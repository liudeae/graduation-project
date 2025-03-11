<template>
    <div class="file-list-container">
        <el-button type="primary" @click="downloadSelectedFiles" :disabled="selectedFiles.length === 0" class="download-all-button">
            下载选定的文件
        </el-button>
        <el-table :data="files" stripe border style="width: 100%" class="file-list-table" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column property="filename" label="名称" width="360">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon v-if="scope.row.filetype !== 0">
                            <Document />
                        </el-icon>
                        <el-icon v-else-if="scope.row.filetype === 0">
                            <Folder />
                        </el-icon>
                        <span v-if="scope.row.filetype !== 0" style="margin-left: 10px">{{ scope.row.filename }}</span>
                        <span v-else-if="scope.row.filetype === 0" style="margin-left: 10px" @click="clickFolder(scope.row.item_id)">{{ scope.row.filename }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column property="modificationdate" label="修改日期" width="240" />
            <el-table-column property="filetype" label="类型" width="240" />
            <el-table-column property="filesize" label="大小" />
            <el-table-column label="操作" width="120">
                <template #default="scope">
                    <el-button type="text" @click="downloadFile(scope.row)" v-if="scope.row.filetype !== 0">
                        下载
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import {useTabStore} from "@/store/TabStore";
import { Document,Folder } from '@element-plus/icons-vue'
import {useDeviceStore} from "@/store/DevicesStore";
import {Device, File, FileTabData, Storage} from "@/js/models";
import {computed, ref} from "vue";
import { v4 as uuidv4 } from 'uuid';
import {useDownloadTaskStore} from "@/store/DownloadTaskStore";

const props = defineProps(['id'])
const tabStore = useTabStore();
const deviceStore = useDeviceStore()
const taskStore = useDownloadTaskStore();

const data = tabStore.data.find((item:any) => item.tabId === props.id)
const device = deviceStore.deviceArray.find((item:Device) => item.serialnumber === data.deviceSerialnumber)
const storage = device.storages.find((item : Storage) => item.id === data.storageId)
const files = computed(() => storage.fileMap.get(data.currentFolderId)?.children);

const selectedFiles = ref<any[]>([])

const handleSelectionChange = (selection: any[]) => {
    selectedFiles.value = selection
}
const clickFolder = (id : number) => {
    let file = storage.fileMap.get(id)
    console.log('clickFolder file:',file)
    if (!file || file.filetype !== 0 || file.parent_id !== data.currentFolderId)
        return
    data.currentFolderId = id
    data.folderRouter.push(file)
    console.log('clickFolder data:' , data)
    if(!file.isLoad){
        deviceStore.getFiles(device.id, storage.id, id)
        file.isLoad = true
    }
}
const downloadFile = (file: File) => {
    if (file.filetype === 0) return // 文件夹不能下载
    console.log('下载文件:', file)
    let task = {taskId: uuidv4(),
        send: 0,
        total: file.filesize,
        speed: 0,
        lastUpdated : Date.now(),
        targetPath: file.filename,
        status: 'waiting',
        fileId: file.item_id,
        filename: file.filename,
        storageId: file.storage_id,
        serialnumber: device.serialnumber}
    taskStore.addTask(task)
}

const downloadSelectedFiles = () => {
    if (selectedFiles.value.length === 0) return
    console.log('下载选定的文件:', selectedFiles.value)
    // 这里添加批量下载文件的逻辑
    for (let file of selectedFiles.value) {
        let task = {taskId: uuidv4(),
            send: 0,
            total: file.filesize,
            speed: 0,
            lastUpdated : Date.now(),
            targetPath: file.filename,
            status: 'waiting',
            fileId: file.item_id,
            filename: file.filename,
            storageId: file.storage_id,
            serialnumber: device.serialnumber}
        taskStore.addTask(task)
    }
}
</script>

<style scoped>
.file-list-container {
    padding: 20px;
}

.file-list-table {
    margin-top: 10px;
}

.download-all-button {
    margin-bottom: 10px;
}

.el-button--text {
    color: #409EFF;
}

.el-button--text:disabled {
    color: #C0C4CC;
}
</style>
