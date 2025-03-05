<template>
    <el-table :data="files"  stripe  border  style="width: 100%" class="file-list-el-table">
        <el-table-column type="selection" width="100" />
        <el-table-column property="filename" label="名称" width="360" >
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
    </el-table>
</template>

<script lang="ts" setup>
    import {useTabStore} from "@/store/TabStore";
    import { Document,Folder } from '@element-plus/icons-vue'
    import {useDeviceStore} from "@/store/DevicesStore";
    import {Device, FileTabData, Storage} from "@/js/models";
    import {computed} from "vue";

    const props = defineProps(['id'])
    const tabStore = useTabStore();
    const deviceStore = useDeviceStore()

    const data = tabStore.data.find((item:any) => item.tabId === props.id)
    console.log('data:',data)
    const device = deviceStore.deviceArray.find((item:Device) => item.serialnumber === data.deviceSerialnumber)
    console.log('device:',device)
    const storage = device.storages.find((item : Storage) => item.id === data.storageId)
    console.log('storage:',storage)
    // const files = computed(() => storage.fileMap.get(data.currentFolderId)?.children);
    const files = computed(() => storage.fileMap.get(data.currentFolderId)?.children);
    console.log('files:',files)


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
</script>

<style scoped>
    .file-list-el-table{
        margin-top: 10px;
    }
</style>
