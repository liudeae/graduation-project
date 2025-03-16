const express = require('express');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();
const cors = require('cors');
const path = require('path');
app.use(express.json());
app.use(cors());

const HTTP_PORT = 3000;
const WS_PORT = 8080;
const tasks = new Map(); // 跟踪下载任务
const task = [];

// HTTP服务器
app.get('/devices', (req, res) => {
    const child = spawn('./test', ['open_device']);
    let output = '';
    child.stdout.on('data', (data) => output += data);
    child.on('close', (code) => {
        console.log('data:', output);
        let index = output.indexOf('{');
        output = output.substring(index, output.length);
        if (code === 0) {
            try {
                res.json(JSON.parse(output));
            } catch (e) {
                res.status(500).json({ code: 1, msg: '解析设备信息失败' });
            }
        } else {
            res.status(500).json({ code: 1, msg: '无法获取设备列表' });
        }
    });
});

app.get('/files', (req, res) => {
    const { deviceIndex, storageId, parentId } = req.query;
    const child = spawn('./test', ['open_folder', deviceIndex, storageId, parentId]);
    let output = '';
    child.stdout.on('data', (data) => output += data);
    child.on('close', (code) => {
        console.log('data:', output);
        let index = output.indexOf('{');
        output = output.substring(index, output.length);
        code === 0 ? res.json(JSON.parse(output)) : res.status(500).json({ code: 1, msg: '获取文件列表失败' });
    });
});

app.get('/download', (req, res) => {
    download(req, res).then((result) => {});

    let data = {code: 0, msg: 'download start'};

    res.json(data);

    //
    // // 超时检测
    // const timeout = setTimeout(() => {
    //     task.child.kill();
    //     tasks.delete(taskId);
    //     broadcastError(taskId, 'Operation timeout');
    // }, 3600*1000); // 1小时超时

});
const  download = async (req) =>{
    const { deviceIndex, fid ,targetPath, taskId } = req.query;

    const dir = path.dirname(targetPath);
    const filename = path.basename(targetPath);
    const normalizedDir = dir === '.' ? '' : dir;

    const child = spawn('./test', ['download', deviceIndex, fid, normalizedDir, filename]);
    const task = {child:child, status: 'running'};
    tasks.set(taskId, task);

    // 节流相关变量
    const throttleInterval = 300; // 设置发送间隔为 1 秒
    let lastSendTime = 0;
    let lastSend = 0

    child.stdout.on('data', (data) => {
        let dataString = data.toString();
        if (dataString.startsWith('PROGRESS:')) {
            const currentTime = Date.now();
            dataString = dataString.substring(9)
            let [sendStr, totalStr] = dataString.split(','); // 拆分已发送和总字节数
            let send = parseInt(sendStr, 10);
            let total = parseInt(totalStr, 10);

            // 如果距离上次发送的时间超过了设定的间隔，则立即发送
            if (currentTime - lastSendTime >= throttleInterval || send === total) {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        console.log(`${formatBytes(send)},${formatBytes(total)}: ${formatBytes((send - lastSend) / (currentTime - lastSendTime) *1000)}`);
                        client.send(taskId + ':' + dataString);
                    }
                });
                lastSend = send
                lastSendTime = currentTime;
                if(send === total)
                    task.status = 'success';
            }
        }
    });

    child.on('close', (code) => {
        if (task.status !== 'success')
            task.status = 'paused';
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(task.status +':'+ taskId)
            }
        });
        tasks.delete(taskId);
    });
}
app.get('/all_files', (req, res) => {
    const { deviceIndex, storageId, parentId } = req.query;
    const child = spawn('./test', ['list_all_files', deviceIndex, storageId, parentId]);

    let output = '';
    child.stdout.on('data', (data) => output += data);

    child.on('close', (code) => {
        if (code === 0) {
            try {
                const result = JSON.parse(output);
                if (result.code === 0) {
                    res.json({
                        code: 0,
                        data: formatFileTree(result.data)
                    });
                } else {
                    res.status(500).json(result);
                }
            } catch(e) {
                res.status(500).json({ code: 1, msg: '解析失败' });
            }
        } else {
            res.status(500).json({ code: 1, msg: '操作失败' });
        }
    });
});
app.get('/stop', (req, res) => {
    const { taskId } = req.query;
    const task = tasks.get(taskId);
    if (task) {
        task.child.kill();
        tasks.delete(req.params.taskId);
        res.json({ code: 0, msg: '已停止下载' });
    } else {
        res.status(404).json({ code: 1, msg: '任务不存在' });
    }
});

// WebSocket服务器
const wss = new WebSocket.Server({ port: WS_PORT });
wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        try {
            const { taskId } = JSON.parse(msg);
            ws.taskId = taskId; // 订阅特定任务
        } catch (e) { /* 无效消息 */ }
    });
});
function formatFileTree(data) {
    return data.map(item => ({
        id: item.item_id,
        name: item.filename,
        type: item.filetype === 0 ? 'folder' : 'file',
        size: item.filesize,
        modified: item.modificationdate,
        children: item.children ? formatFileTree(item.children) : []
    }));
}
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}
app.listen(HTTP_PORT, () => console.log(`HTTP服务器运行在端口 ${HTTP_PORT}`));