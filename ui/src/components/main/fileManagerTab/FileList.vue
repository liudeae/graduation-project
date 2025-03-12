<template>
    <div>
        <el-button type="primary" @click="downloadSelectedFiles"  class="download-all-button" :disabled="multipleSelection.length === 0">
            下载选定的文件
        </el-button>
        <el-input class="file-list-input" :prefix-icon="Search" clearable ></el-input>
    </div>
    <div  class="file-list-container">
        <el-table :data="files"  stripe  border  style="width: 100%" class="file-list-table" max-height="450" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="100" />
            <el-table-column property="filename" label="名称" width="360" show-overflow-tooltip>
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-icon v-if="scope.row.filetype !== 0" :color="'darkgoldenrod'" :size="20">
                            <Document/>
                        </el-icon>
                        <el-icon v-else-if="scope.row.filetype === 0"  :color="'darkgoldenrod'" :size="20">
                            <Folder/>
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
                    <el-button type="primary" @click="downloadFile(scope.row)" link>
                        下载
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>


</template>

<script lang="ts" setup>
    import {useTabStore} from "@/store/TabStore";
    import { Document,Folder,Search } from '@element-plus/icons-vue'
    import {useDeviceStore} from "@/store/DevicesStore";
    import {Device, File, FileTabData, Storage} from "@/js/models";
    import {computed, ref} from "vue";
    import {v4 as uuidv4} from "uuid";
    import {useDownloadTaskStore} from "@/store/DownloadTaskStore";

    const props = defineProps(['id'])
    const tabStore = useTabStore();
    const deviceStore = useDeviceStore()
    const taskStore = useDownloadTaskStore();

    const multipleSelection = ref<File[]>([])

    const data = tabStore.data.find((item:any) => item.tabId === props.id)
    console.log('data:',data)
    const device = deviceStore.deviceArray.find((item:Device) => item.serialnumber === data.deviceSerialnumber)
    console.log('device:',device)
    const storage = device.storages.find((item : Storage) => item.id === data.storageId)
    console.log('storage:',storage)
    // const files = computed(() => storage.fileMap.get(data.currentFolderId)?.children);
    const files = computed(() => storage.fileMap.get(data.currentFolderId)?.children.sort((a, b) => a.filetype - b.filetype));
    console.log('files:',files)

    const handleSelectionChange = (val: File[]) => {
        multipleSelection.value = val
        console.log('multipleSelection:',multipleSelection.value)
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

    //todo: 文件夹下载另外处理
    const downloadFile = (file: File) => {
        if (file.filetype === 0) return
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
        if (multipleSelection.value.length === 0) return
        console.log('下载选定的文件:', multipleSelection.value)
        // 这里添加批量下载文件的逻辑
        for (let file of multipleSelection.value) {
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
    .file-list-table{
        margin-top: 10px;
    }
    .file-list-input{
        width: 400px;
        float: left;
        margin: 10px 20px 10px 10px;
    }
    .download-all-button {
        float: right;
        margin: 10px;
    }

</style>
