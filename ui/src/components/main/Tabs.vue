<template>
    <el-tabs v-model="store.currentTab" type="card" class="demo-tabs" editable @edit="handleTabsEdit">
        <template #add-icon style="margin-left: 20px">
<!--            <el-icon><Select /></el-icon>-->
            <el-tooltip
                class="box-item"
                effect="dark"
                content="关闭全部标签"
                placement="top-start"
            >
                <el-icon color="red" @click="store.closeAllTabs()" ><CloseBold  /></el-icon>
            </el-tooltip>

        </template>
        <el-tab-pane class="demo" v-for="item in store.tabs" :key="item.id" :label="item.title" :name="item.id">
            <template v-if="item.component === componentType.FileManager">
                <FileManager :id="item.id" />
            </template>
            <template v-else-if="item.component === componentType.BatchDownload">
                <BatchDownload :id="item.id" />
            </template>
            <template v-else-if="item.component === componentType.DownloadManager">
                <DownloadManager :id="item.id" />
            </template>
            <template v-else-if="item.component === componentType.DeviceDisplay">
                <DeviceDisplay :id="item.id" />
            </template>
        </el-tab-pane>
        <div class="demo" v-if="store.tabs.length == 0">
            <el-empty :image-size="200" class="empty" />
        </div>
    </el-tabs>

</template>

<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue'
import type { TabPaneName } from 'element-plus'
import {useTabStore} from "@/store/TabStore";
import FileManager from "@/components/main/fileManagerTab/FileManager.vue";
import BatchDownload from "@/components/main/batchDownloadTab/BatchDownload.vue";
import DownloadManager from "@/components/main/downloadTab/DownloadManager.vue";
import DeviceDisplay from "@/components/main/deviceDisplay/DeviceDisplay.vue";
import {componentType} from "@/js/enum";

const store = useTabStore();

const handleTabsEdit = (
    targetName: TabPaneName | undefined,
    action: 'remove' | 'add'
) => {
    if (action === 'add') {
        // store.addTab(new Tab('new','newTab', {deviceSerialnumber: '1', storageId:1,folderRouter:[]}, componentType.FileManager))
    } else if (action === 'remove') {
        if (store.currentTab == targetName) {
            store.tabs.forEach((tab, index) => {
                if (tab.id === targetName) {
                    const nextTab = store.tabs[index + 1] || store.tabs[index - 1]
                    if (nextTab)
                        store.currentTab = nextTab.id
                }
            })
        }
        store.removeTab(targetName as string);
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
    .demo {
        overflow: auto;
        width: 100%;
        height: 100%;
    }

    .tabs-content {
        width: 100%;
        height: 100%;
    }
    .empty {
        height: 100%;
        width: 100%;
    }
</style>