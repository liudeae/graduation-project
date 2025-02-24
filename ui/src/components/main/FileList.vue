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
    import {useTabInfoStore} from "@/store/TabStore";
    import { Document,Folder } from '@element-plus/icons-vue'
    import {File} from "@/models/File";

    const props = defineProps(['id'])
    const tabInfoStore = useTabInfoStore();

    tabInfoStore.fileList(props.id)
    const files:File[] = tabInfoStore.tabs.find(tabInfo => tabInfo.id === props.id).data.files
    // const infoStore = useInfoStore();
    // let data: TabFileData | undefined = tabInfoStore.tabs.find(tab => tab.id === props.id)?.data
    // let files: Map<number,File> | undefined = infoStore.devices.get(data.deviceSerialnumber)
    //     ?.storages.find(item => item.id == data?.storageId)?.files
    // let currentFolderId = tabInfoStore.getCurrentFolder(props.id);
    // const files:File[] = infoStore.
    // let currentFolder =


</script>

<style scoped>
    .file-list-el-table{
        margin-top: 10px;
        //box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
    }
</style>
