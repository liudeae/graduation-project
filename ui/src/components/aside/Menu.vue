<template>
    <el-row class="tac">
        <el-col >
<!--            <h3 class="mb-2">Default colors</h3>-->
            <el-menu class="el-menu-vertical-demo"> <!--@open="handleOpen" @close="handleClose">-->
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><list /></el-icon>
                        <span>文件列表</span>
                    </template>
                    <el-sub-menu :index="`1-${device.index}`" v-for="device in store.deviceArray" :key="`file-${device.index}`">
                        <template #title>{{device.vendor}}</template>
                        <div v-for="storage  in device.storages" :key="storage.id" @click="addFMTab(device, storage)">
                            <el-menu-item :index="`1-${device.index}-${storage.id}`">存储{{storage.id}}</el-menu-item>
                        </div>
                    </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2">
                    <el-icon><icon-menu /></el-icon>
                    <span>设备信息</span>
                </el-menu-item>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon><document /></el-icon>
                        <span>批量下载</span>
                    </template>
                    <el-sub-menu :index="`3-${device.index}`" v-for="device in store.deviceArray" :key="device.index">
                        <template #title>{{device.vendor}}</template>
                        <div v-for="storage  in device.storages" :key="`batch-${device.index}`" @click="addBDTab(device, storage)">
                            <el-menu-item :index="`3-${device.index}-${storage.id}`" @click="">存储{{storage.id}}</el-menu-item>
                        </div>
                    </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="4">
                    <el-icon><setting /></el-icon>
                    <span>下载管理</span>
                </el-menu-item>
            </el-menu>
        </el-col>
        <div id="placeholder"></div>
    </el-row>
</template>

<script lang="ts" setup>
    import {Document, List as IconMenu, List, Setting} from '@element-plus/icons-vue'
    import {useDeviceStore} from "@/store/DevicesStore";
    import {useTabStore} from "@/store/TabStore";
    import {BDData, componentType, Device, FileTabData, Storage} from "@/js/models";

    const store = useDeviceStore();
    const tabInfoStore = useTabStore();

    const addBDTab = (device: Device, storage: Storage) => {
        let data: BDData = { serialnumber:device.serialnumber, storageId: storage.id} as BDData;
        tabInfoStore.addTab('批量下载', data, componentType.BatchDownload)
    }
    const addFMTab = (device: Device, storage: Storage) => {
        let data:FileTabData = {deviceSerialnumber:device.serialnumber, storageId: storage.id, folderRouter: [], currentFolderId: 0} as FileTabData
        tabInfoStore.addTab('文件列表', data, componentType.FileManager)
        if(!storage.fileList.isLoad)
            store.getFiles(device.index, storage.id, 0)
        console.log('device:::::',store.devices)
    }

// const handleOpen = (key: string, keyPath: string[]) => {
//
//     }
//     const handleClose = (key: string, keyPath: string[]) => {
//
//     }
</script>

<style scoped>
    .tac {
        max-height: 100%;
        overflow: scroll;
    }
    /* 隐藏滚动条 */
    .tac::-webkit-scrollbar {
        display: none; /* 隐藏滚动条（WebKit浏览器） */
    }
    .tac {
        -ms-overflow-style: none; /* 隐藏滚动条（IE/Edge） */
        scrollbar-width: none; /* 隐藏滚动条（Firefox） */
    }
    #placeholder {
        height: 100px;
        width: 100%;
    }
</style>
