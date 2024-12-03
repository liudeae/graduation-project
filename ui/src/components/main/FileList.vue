<template>
    <el-table ref="multipleTableRef" :data="fileInfo" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column property="filename" label="名称" width="120" />
        <el-table-column property="modificationdate" label="修改日期" width="120" />
        <el-table-column property="filesize" label="大小" />
    </el-table>
</template>

<script lang="ts" setup>
    import { ref, onMounted } from 'vue'
    import type { TableInstance } from 'element-plus'
    import {useFileStore} from '@/store/Info'
    import {FileInfo} from "@/store/Info";


    const multipleTableRef = ref<TableInstance>()
    const multipleSelection = ref<FileInfo[]>([])
    const store = useFileStore()
    const files = ref<FileInfo[]>([])

    onMounted(() => {
        // store.file = new FileInfo()
        files.value= store.file

    })
    let fileInfo = store.file;
    console.log(fileInfo)
    const handleSelectionChange = (val: FileInfo[]) => {
        multipleSelection.value = val
        console.log('Selection changed:', multipleSelection.value);
    }
</script>