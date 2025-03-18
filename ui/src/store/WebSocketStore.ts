import { defineStore } from 'pinia';
import {DownloadTask} from "../js/models";
import {useDownloadTaskStore} from "./DownloadTaskStore";
import {useSettingStore} from "./SettingStore";
import {useLockStore} from "./LockStore";

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        socket: null as WebSocket | null, // WebSocket 实例
        isConnected: false, // 连接状态
    }),
    actions: {
        // 初始化 WebSocket 连接
        //todo: 对其他信息进行处理
        connect() {
            const settingStore = useSettingStore();
            const serverIp = settingStore.webSocketURL()

            if (this.socket) {
                this.socket.close(); // 关闭之前的连接
            }
            // 创建新的 WebSocket 连接
            this.socket = new WebSocket(serverIp);

            // 监听连接成功
            this.socket.onopen = () => {
                this.isConnected = true;
                console.log('WebSocket 连接成功');
            };

            // 监听消息
            this.socket.onmessage = (event: MessageEvent) => {
                const lockStore = useLockStore();
                const taskStore = useDownloadTaskStore();
                try {
                    const message = event.data as string; // 服务器消息格式：taskId:send,total
                    console.log(message)
                    if(message.startsWith('success')) {
                        const [status, taskId] = message.split(':');
                        this.updateTask(status, taskId);
                        lockStore.releaseLock(taskStore.tasks[taskId].serialnumber)
                    }else{
                        const [taskId, data] = message.split(':'); // 拆分任务 ID 和数据
                        const [sendStr, totalStr] = data.split(','); // 拆分已发送和总字节数
                        const send = parseInt(sendStr, 10);
                        const total = parseInt(totalStr, 10);

                        if (isNaN(send)) throw new Error('Invalid send value');
                        if (isNaN(total)) throw new Error('Invalid total value');

                        this.updateTaskProgress(taskId, send, total); // 更新任务进度
                    }
                } catch (error) {
                    console.error('解析消息失败:', error);
                    throw error;
                }
            };
            // 监听连接关闭
            this.socket.onclose = () => {
                this.isConnected = false;
                console.log('WebSocket 连接关闭');
            };
            // 监听错误
            this.socket.onerror = (error: Event) => {
                this.isConnected = false;
                console.error('WebSocket 错误:', error);
            };
        },

        // 更新任务进度
        updateTaskProgress(taskId: string, send: number, total: number) {
            const taskStore = useDownloadTaskStore();

            const now = Date.now(); // 当前时间戳
            const task = taskStore.tasks[taskId];

            if (task) {
                // 计算下载速度（字节/秒）
                const timeElapsed = (now - task.lastUpdated) / 1000; // 时间间隔（秒）
                const bytesTransferred = send - task.send; // 传输的字节数
                const speed = bytesTransferred / timeElapsed; // 下载速度
                console.log()
                // 更新任务状态
                task.speed = speed;
                task.send = send;
                task.total = total;
                task.lastUpdated = now;
            } else {
                console.error('ERROR: Unknown task');// 未知taskId
            }
        },
        updateTask(status: string, taskId: string) {
            const taskStore = useDownloadTaskStore();
            const task = taskStore.tasks[taskId];
            if (task) {
                task.status = status;
            }
        },
        // 关闭连接
        disconnect() {
            if (this.socket) {
                this.socket.close();
                this.socket = null;
                this.isConnected = false;
            }
        },
        // 重启客户端
        restart() {
            this.disconnect(); // 关闭当前连接
            this.connect(); // 使用新的 IP 重新连接
        },
    }
});