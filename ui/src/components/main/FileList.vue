<template>
    <el-table :data="files"  stripe  border  style="width: 100%" class="file-list-el-table">
        <el-table-column type="selection" width="100" />
        <el-table-column property="filename" label="名称" width="360" >
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <el-icon v-if="scope.row.filetype !== 0"><Document /></el-icon>
                    <el-icon v-else-if="scope.row.filetype === 0"><Folder /></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.filename }}</span>
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
    import {useDevicesStore} from "@/store/DevicesStore";
    import {FileTabData, TabData} from "@/js/models";

    const props = defineProps(['id'])
    const tabStore = useTabStore();
    const deviceStore = useDevicesStore()

    const data = tabStore.data.find(item => item.tabId === props.id) as FileTabData
    const files = deviceStore.devices.get(data.deviceSerialnumber).storages
        .find(item => item.id === data.storageId).fileMap.get(data.currentFolderId).child
</script>

<style scoped>
    .file-list-el-table{
        margin-top: 10px;
        //box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
    }
</style>
