import {defineStore} from "pinia";
import {DownloadTask, File} from "../js/models";
import {useDeviceStore} from "./DevicesStore";
import {useSettingStore} from "./SettingStore";
import axios from "axios";
import {v4 as uuidv4} from "uuid";
import {useWebSocketStore} from "./WebSocketStore";
import {useLockStore} from "./LockStore";

// @ts-ignore
export const useDownloadTaskStore = defineStore('downloadTask', {
    state: () => ({
        tasks: {} as Record<string, DownloadTask>
    }),
    actions: {
        async download(taskId: string) {//todo 处理0 byte的文件, 提示如果有重名文件如何处理：重命名？覆盖？
            const task = this.tasks[taskId];
            const deviceStore = useDeviceStore();
            const webSocketStore = useWebSocketStore();
            const settingStore = useSettingStore();
            const lockStore = useLockStore();
            const url = settingStore.downloadURL()

            if(!webSocketStore.isConnected)
                webSocketStore.connect()
            if (!task)
                throw new Error("任务不存在：" + taskId);
            const device = deviceStore.devices.get(task.serialnumber);
            let param = {deviceIndex: device?.id, fid: task.fileId, targetPath: task.targetPath, taskId: task.taskId};
            try{
                await lockStore.acquireLock(task.serialnumber)
                await axios.get(url, {params: param}).then(response => {
                    console.log('response',response);
                    if(response.data.code !== 0)
                        throw new Error(`${response.data.msg}`)
                    task.status = 'running';
                })
            } catch (error) {
                task.status = 'failed';
                lockStore.releaseLock(task.serialnumber)
                throw error;
            }

        },
        addTask(task: DownloadTask) {
            if(!this.tasks[task.taskId])
                this.tasks[task.taskId] = task;
        },
        //todo: 删除下载任务时，删除下载成功的部分文件（计划不处理）
        removeTask(taskId: string) {
            delete this.tasks[taskId];
        },
        async pausedTask(taskId: string): Promise<boolean> {
            const settingStore = useSettingStore();
            const lockStore = useLockStore();
            const url = settingStore.stopDownloadURL();
            const task = this.tasks[taskId];
            if (!task)
                throw new Error('任务暂停失败！')
            if (task.status === 'paused')
                return true;
            if (task.status === 'running') {
                const params = { taskId };
                const response = await axios.get(url, { params });

                if (response.data.code !== 0)
                    throw new Error(`${response.data.msg}`)

                lockStore.releaseLock(task.serialnumber)
            }
            task.status = 'paused';
            task.speed = 0;
            return true;
        }
    },
    persist: true
})