<template>
    <el-table :data="files"  stripe  border  style="width: 100%" class="file-list-el-table">
        <el-table-column type="selection" width="100" />
        <el-table-column property="filename" label="名称" width="360" >
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <el-icon v-if="scope.row.filetype !== 0">
                        <Document />
                        <span style="margin-left: 10px">{{ scope.row.filename }}</span>
                    </el-icon>
                    <el-icon v-else-if="scope.row.filetype === 0">
                        <Folder />
                        <span style="margin-left: 10px" @click="clickFolder(scope.row.item_id)">{{ scope.row.filename }}</span>
                    </el-icon>
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

    const props = defineProps(['id'])
    const tabStore = useTabStore();
    const deviceStore = useDeviceStore()

    console.log('props', props.id)
    const data = tabStore.data.find((item:any) => item.tabId === props.id)
    console.log('data', data)
    console.log('device', deviceStore.deviceArray)
    // const device = deviceStore.devices.get(data.deviceSerialnumber)
    const device = deviceStore.deviceArray.find((item:Device) => item.deviceId === props.id)
    console.log('FileList device:',device)
    const storage = device.storages.find((item : Storage) => item.serialnumber === data.deviceSerialnumber)
    const files = storage.fileMap.get(data.currentFolderId).child

    const clickFolder = (id : number) => {
        let file = storage.fileMap.get(id)
        if (!file || file.filetype !== 0 || file.parent_id !== data.currentFolderId)
            return
        data.currentFolderId = id
        data.folderRouter.push(file)
        if(!file.isLoad){
            deviceStore.getFiles(device.index, storage.id, id)
            file.isLoad = true
        }
    }

</script>

<style scoped>
    .file-list-el-table{
        margin-top: 10px;
    }
</style>
