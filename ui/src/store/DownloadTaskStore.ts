import {defineStore} from "pinia";
import {DownloadTask, File} from "../js/models";
import {useDeviceStore} from "./DevicesStore";
import {useSettingStore} from "./SettingStore";
import axios from "axios";

// @ts-ignore
export const useDownloadTaskStore = defineStore('downloadTask', {
    state: () => ({
        tasks: {} as Record<string, DownloadTask>
    }),
    actions: {
        download(taskId: string) {
            const task = this.tasks[taskId];
            const deviceStore = useDeviceStore();
            const settingStore = useSettingStore();
            const url = 'http://' + settingStore.ipAddress + ':3000/download';

            if (!task) //任务不存在
                return;
            if(deviceStore.devicesInUse.has(task.serialnumber))//usb使用中
                return;
            const device = deviceStore.devices.get(task.serialnumber);
            let param = {deviceIndex: device?.id, fid: task.fileId, offset: task.send, path: task.targetPath, taskId: task.taskId};
            axios.get(url, {params: param}).then(response => {
                if(response.data.code !== 0){
                    console.log(response.data.msg);
                    return;
                }
                deviceStore.devicesInUse.add(task.serialnumber);
            })
        },
        addTask(task: DownloadTask) {
            if(!this.tasks[task.taskId])//task不存在
                this.tasks[task.taskId] = task;
        },
        //todo: 删除下载任务时，删除下载成功的部分文件
        removeTask(taskId: string) {
            delete this.tasks[taskId];//
        },
    },
    persist: true
})