<template>
    <div>
        <el-button type="primary" @click="downloadSelectedFiles"  class="download-all-button" :disabled="multipleSelection.length === 0">
            下载选定的文件
        </el-button>
        <el-input class="file-list-input" :prefix-icon="Search" clearable v-model="filterText" placeholder="请输入关键词进行过滤"></el-input>
    </div>
    <div  class="file-list-container">
        <el-table :data="filterFiles"  stripe  border  style="width: 100%" class="file-list-table" max-height="600" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="100" />
            <el-table-column property="item_id" label="id" width="100" >
                <template #default="scope">
                    {{scope.row.item_id}}
                </template>
            </el-table-column>
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
            <el-table-column property="filetype" label="类型" width="240" >
                <template #default="scope">
                    {{ typeReverse[scope.row.filetype] }}
                </template>
            </el-table-column>
            <el-table-column property="filesize" label="大小">
                <template #default="scope">
                    <span v-if="scope.row.filetype !== 0">
                        {{ formatBytes(scope.row.filesize) }}
                  </span>
                    <span v-else>
                        {{ '' }}
                  </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template #default="scope">
                    <el-button type="primary" @click="downloadFile(scope.row)" v-if="scope.row.filetype !== 0" link>
                        下载
                    </el-button>
                    <el-button type="primary" @click="downloadFolder(scope.row)" v-if="scope.row.filetype === 0" link>
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
    import {formatBytes} from "@/js/common";
    import {typeReverse} from "@/js/enum";

    const props = defineProps(['id'])
    const tabStore = useTabStore();
    const deviceStore = useDeviceStore()
    const taskStore = useDownloadTaskStore();


    const multipleSelection = ref<File[]>([])
    const filterText = ref<string>("")

    const data = tabStore.data.find((item:any) => item.tabId === props.id)
    console.log('data:',data)
    const device = deviceStore.deviceArray.find((item:Device) => item.serialnumber === data.deviceSerialnumber)
    console.log('device:',device)
    const storage = device.storages.find((item : Storage) => item.id === data.storageId)
    console.log('storage:',storage)
    // const files = computed(() => storage.fileMap.get(data.currentFolderId)?.children);
    // const files = computed(() => storage.fileMap.get(data.currentFolderId)?.children.sort((a, b) => a.filetype - b.filetype));
    const filterFiles = computed(() => {
        let files = storage.fileMap.get(data.currentFolderId)?.children.sort((a, b) => a.filetype - b.filetype)
        if (!filterText.value)
            return files
        return files.filter(file => file.filename.includes(filterText.value))
    })
    console.log('files:',filterFiles)

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
    const downloadFile = (file: File, parentPath?: string) => {
        if (file.filetype === 0) return
        console.log('下载文件:', file)
        let targetPath: string = parentPath ? `${parentPath}/${file.filename}` : file.filename
        let task = {taskId: uuidv4(),
            send: 0,
            total: file.filesize,
            speed: 0,
            lastUpdated : Date.now(),
            targetPath: targetPath,
            status: 'paused',
            fileId: file.item_id,
            filename: file.filename,
            storageId: file.storage_id,
            serialnumber: device.serialnumber}
        taskStore.addTask(task)
    }
    const downloadFolder= async (folder: File, parentPath?: string) => {
        if (folder.filetype !== 0) return
        if(folder.isLoad && !folder.children) return
        if(!folder.isLoad) //加载文件夹下面的所有文件信息
            await deviceStore.getFiles(device.id, storage.id, folder.item_id)
        let targetPath: string = parentPath ? `${parentPath}/${folder.filename}` : folder.filename
        console.log('downloadFolder data:', folder)
        for(let file of folder.children){
            console.log('children data:', file)
            if(file.filetype !== 0)
                downloadFile(file, targetPath)
            else
                await downloadFolder(file, targetPath)
        }
    }
    const downloadSelectedFiles = async () => {
        if (multipleSelection.value.length === 0) return
        console.log('下载选定的文件:', multipleSelection.value)
        // 这里添加批量下载文件的逻辑
        for (let file of multipleSelection.value) {
            if(file.filetype !== 0)
                downloadFile(file)
            else
                await downloadFolder(file)
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
        margin: 10px 20px 10px 0;
    }
    .download-all-button {
        float: right;
        margin: 10px;
    }

</style>
