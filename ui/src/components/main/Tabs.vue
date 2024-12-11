<template>
    <el-tabs v-model="store.currentTab" type="card" class="demo-tabs" editable @edit="handleTabsEdit">
        <template #add-icon>
            <el-icon><Select /></el-icon>
        </template>
        <el-tab-pane id="demo" v-for="item in store.tabs" :key="item.id" :label="item.title" :name="item.id">
            <div v-if="item.component == componentType.FileManager">
                <FileManager :id="item.id" />
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import { Select } from '@element-plus/icons-vue'
import type { TabPaneName } from 'element-plus'
import {useTabInfoStore} from "@/store/TabInfo";
import FileManager from "@/components/main/FileManager.vue";
import {componentType, Tab} from "@/models/Tab";

const store = useTabInfoStore();
onMounted(() =>{

    store.tabsInit()
    console.log(store.tabs[0].component)
})

const handleTabsEdit = (
    targetName: TabPaneName | undefined,
    action: 'remove' | 'add'
) => {
    if (action === 'add') {
        store.addTab(new Tab('new','newTab', {deviceSerialnumber: '1', storageId:1,folderRouter:[]}, componentType.FileManager))
    } else if (action === 'remove') {
        // store.tabs.splice()
        // const tabs = editableTabs.value
        // let activeName = editableTabsValue.value
        //
        // if (activeName === targetName) {
        //     tabs.forEach((tab, index) => {
        //         if (tab.name === targetName) {
        //             const nextTab = tabs[index + 1] || tabs[index - 1]
        //             if (nextTab) {
        //                 activeName = nextTab.name
        //             }
        //         }
        //     })
        // }
        //
        // editableTabsValue.value = activeName
        // editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
    }
}
</script>

<style>
    .demo-tabs {
        width: 100%;
        height: 100%;
    }
    .demo-tabs .el-tabs__header{
        margin: 0;
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
<!--<template>-->
<!--    <el-tabs-->
<!--        v-model="editableTabsValue"-->
<!--        type="card"-->
<!--        class="demo-tabs"-->
<!--        editable-->
<!--        @edit="handleTabsEdit"-->
<!--    >-->
<!--        <template #add-icon>-->
<!--            <el-icon><Select /></el-icon>-->
<!--        </template>-->
<!--        <el-tab-pane-->
<!--            v-for="item in editableTabs"-->
<!--            :key="item.name"-->
<!--            :label="item.title"-->
<!--            :name="item.name"-->
<!--        >-->
<!--            {{ item.content }}-->
<!--        </el-tab-pane>-->
<!--    </el-tabs>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import { ref } from 'vue'-->
<!--import { Select } from '@element-plus/icons-vue'-->
<!--import type { TabPaneName } from 'element-plus'-->

<!--let tabIndex = 555-->
<!--const editableTabsValue = ref('2')-->
<!--const editableTabs = ref([-->
<!--    {-->
<!--        title: 'Tab 1',-->
<!--        name: '10',-->
<!--        content: 'Tab 1 content',-->
<!--    },-->
<!--    {-->
<!--        title: 'Tab 2',-->
<!--        name: '2',-->
<!--        content: 'Tab 2 content',-->
<!--    },-->
<!--    {-->
<!--        title: 'Tab 3',-->
<!--        name: '9hjj',-->
<!--        content: 'Tab 3 content',-->
<!--    },-->
<!--    {-->
<!--        title: 'Tab 4',-->
<!--        name: '161111111',-->
<!--        content: 'Tab 4 content',-->
<!--    },-->
<!--])-->

<!--const handleTabsEdit = (-->
<!--    targetName: TabPaneName | undefined,-->
<!--    action: 'remove' | 'add'-->
<!--) => {-->
<!--    if (action === 'add') {-->
<!--        const newTabName = `${++tabIndex}`-->
<!--        editableTabs.value.push({-->
<!--            title: 'New Tab',-->
<!--            name: newTabName,-->
<!--            content: 'New Tab content',-->
<!--        })-->
<!--        editableTabsValue.value = newTabName-->
<!--    } else if (action === 'remove') {-->
<!--        const tabs = editableTabs.value-->
<!--        let activeName = editableTabsValue.value-->
<!--        if (activeName === targetName) {-->
<!--            tabs.forEach((tab, index) => {-->
<!--                if (tab.name === targetName) {-->
<!--                    const nextTab = tabs[index + 1] || tabs[index - 1]-->
<!--                    if (nextTab) {-->
<!--                        activeName = nextTab.name-->
<!--                    }-->
<!--                }-->
<!--            })-->
<!--        }-->

<!--        editableTabsValue.value = activeName-->
<!--        editableTabs.value = tabs.filter((tab) => tab.name !== targetName)-->
<!--    }-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--.demo-tabs > .el-tabs__content {-->
<!--    padding: 32px;-->
<!--    color: #6b778c;-->
<!--    font-size: 32px;-->
<!--    font-weight: 600;-->
<!--}-->
<!--</style>-->