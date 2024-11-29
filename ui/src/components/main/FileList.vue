<template>
    <el-table ref="multipleTableRef" :data="fileInfo" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column property="filename" label="名称" width="120" />
        <el-table-column property="modificationdate" label="修改日期" width="120" />
        <el-table-column property="filesize" label="大小" />
    </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableInstance } from 'element-plus'
import {useFileInfoStore} from '@/store/fileInfo'

const multipleTableRef = ref<TableInstance>()
// const multipleSelection = ref<User[]>([])
const store = useFileInfoStore()

let fileInfo = store.fileInfo;
console.log(fileInfo)
// const handleSelectionChange = (val: User[]) => {
//     multipleSelection.value = val
// }
</script>