const express = require('express');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();
const cors = require('cors');
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

    res.json(JSON.stringify(data));

    //
    // // 超时检测
    // const timeout = setTimeout(() => {
    //     task.child.kill();
    //     tasks.delete(taskId);
    //     broadcastError(taskId, 'Operation timeout');
    // }, 3600*1000); // 1小时超时

});
const  download = async (req) =>{
    const { deviceIndex, fid, offset ,path, taskId } = req.query;
    const child = spawn('./test', ['download', deviceIndex, fid, offset, path]);
    const task = {child:child, status: 'running'};
    tasks.set(taskId, task);

    // 改进的数据处理
    child.stdout.on('data', (data) => {
        let dataString = data.toString();
        console.log(data);
        if(dataString.startsWith('PROGRESS:')){
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(taskId + ':' + dataString.substring(9));
                }
            });
        }
    });

    child.on('close', (code) => {
        if (task.status === 'running')
            task.status = 'completed';
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
app.post('/stop/:taskId', (req, res) => {
    const task = tasks.get(req.params.taskId);
    if (task) {
        task.child.kill();
        saveOffset(task.path, task.offset); // 保存偏移量
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
app.listen(HTTP_PORT, () => console.log(`HTTP服务器运行在端口 ${HTTP_PORT}`));