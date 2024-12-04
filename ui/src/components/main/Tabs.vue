<template>
    <el-tabs v-model="editableTabsValue" type="card" class="demo-tabs" editable @edit="handleTabsEdit">
        <template #add-icon>
            <el-icon><Select /></el-icon>
        </template>
        <el-tab-pane id="demo" v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        <FileManager></FileManager>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import FileManager from "@/components/main/FileManager.vue";
import { ref } from 'vue'
import { Select } from '@element-plus/icons-vue'
import type { TabPaneName } from 'element-plus'


let tabIndex = 1
const editableTabsValue = ref('1')
const editableTabs = ref([
    {
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content',
        html: '',
    },
])

const handleTabsEdit = (
    targetName: TabPaneName | undefined,
    action: 'remove' | 'add'
) => {
    if (action === 'add') {
        const newTabName = `${++tabIndex}`
        editableTabs.value.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content',
            html: '',
        })
        editableTabsValue.value = newTabName
    } else if (action === 'remove') {
        const tabs = editableTabs.value
        let activeName = editableTabsValue.value

        if (activeName === targetName) {
            tabs.forEach((tab, index) => {
                if (tab.name === targetName) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        activeName = nextTab.name
                    }
                }
            })
        }

        editableTabsValue.value = activeName
        editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
    }
}
</script>

<style>
    .demo-tabs {
        width: 100%;
        height: 100%;
    }
    .demo-tabs > .el-tabs__content {

    }
    #demo {
        overflow: auto;
        width: 100%;
        height: 100%;
    }
    .tabs-content {
        width: 100%;
        height: 100%;
    }
</style>
