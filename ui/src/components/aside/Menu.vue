<template>
    <el-row class="tac">
        <el-col>
            <h3 class="menu-title">菜单</h3>
            <el-menu class="el-menu-vertical-demo">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><list /></el-icon>
                        <span>文件列表</span>
                    </template>
                    <el-sub-menu :index="`1-${device.id}`" v-for="device in store.deviceArray" :key="`file-${device.id}`">
                        <template #title>{{device.vendor}}</template>
                        <div v-for="storage in device.storages" :key="storage.id" @click="addFMTab(device, storage)">
                            <el-menu-item :index="`1-${device.id}-${storage.id}`">{{storage.StorageDescription}}</el-menu-item>
                        </div>
                    </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2" @click="addDDTab">
                    <el-icon><icon-menu /></el-icon>
                    <span>设备信息</span>
                </el-menu-item>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon><document /></el-icon>
                        <span>批量下载</span>
                    </template>
                    <el-sub-menu :index="`3-${device.id}`" v-for="device in store.deviceArray" :key="device.id">
                        <template #title>{{device.vendor}}</template>
                        <div v-for="storage in device.storages" :key="`batch-${device.id}`" @click="addBDTab(device, storage)">
                            <el-menu-item :index="`3-${device.id}-${storage.id}`">{{storage.StorageDescription}}</el-menu-item>
                        </div>
                    </el-sub-menu>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>
                        <el-icon><document /></el-icon>
                        <span>下载管理</span>
                    </template>
                    <el-menu-item :index="`4-${device.id}`" v-for="device in store.deviceArray" :key="device.id" @click="addDMTab(device)">
                        <template #title>{{device.vendor}}</template>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-col>
        <div id="placeholder"></div>
    </el-row>
</template>

<script lang="ts" setup>
    import {Document, List as IconMenu, List, Setting} from '@element-plus/icons-vue'
    import {useDeviceStore} from "@/store/DevicesStore";
    import {useTabStore} from "@/store/TabStore";
    import {BDData, Device, DMData, FileTabData, Storage} from "@/js/models";
    import {componentType} from "@/js/enum";

    const store = useDeviceStore();
    const tabInfoStore = useTabStore();

    const addBDTab = (device: Device, storage: Storage) => {
        let data: BDData = { serialnumber:device.serialnumber, storageId: storage.id} as BDData;
        tabInfoStore.addTab('批量下载', data, componentType.BatchDownload)
    }
    const addFMTab = (device: Device, storage: Storage) => {
        let data:FileTabData = {deviceSerialnumber:device.serialnumber, storageId: storage.id, folderRouter: [], currentFolderId: 0} as FileTabData
        tabInfoStore.addTab('文件列表', data, componentType.FileManager)
        if(!storage.fileList.isLoad)//初始加载root目录下文件信息
            store.getFiles(device.id, storage.id, 0)
        console.log('device:',store.devices)
    }
    const addDMTab = (device: Device) => {
        let data:DMData = {serialnumber:device.serialnumber} as DMData
        tabInfoStore.addTab('下载管理', data, componentType.DownloadManager)
    }
    const addDDTab= () => {
        tabInfoStore.addTab('设备信息', {}, componentType.DeviceDisplay, true)
    }
</script>

<style scoped>
.tac {
    max-height: 100%; /* 使用视口高度 */
    overflow-y: auto; /* 允许垂直滚动 */
    padding: 10px; /* 添加内边距 */
    background-color: #f5f5f5; /* 背景色 */
    border-right: 1px solid #e4e7ed; /* 右边框 */
}

/* 隐藏滚动条 */
.tac::-webkit-scrollbar {
    display: none; /* 隐藏滚动条（WebKit浏览器） */
}

.tac {
    -ms-overflow-style: none; /* 隐藏滚动条（IE/Edge） */
    scrollbar-width: none; /* 隐藏滚动条（Firefox） */
}

.menu-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
}

.el-menu-vertical-demo {
    border-right: none; /* 移除默认边框 */
    background-color: #ffffff; /* 菜单背景色 */
    border-radius: 8px; /* 圆角 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影 */
}

.el-menu-item, .el-sub-menu__title {
    font-size: 14px; /* 字体大小 */
    color: #333; /* 字体颜色 */
    padding: 10px 20px; /* 内边距 */
    transition: background-color 0.3s ease, color 0.3s ease; /* 过渡效果 */
}

.el-menu-item:hover, .el-sub-menu__title:hover {
    background-color: #e6f7ff; /* 鼠标悬停背景色 */
    color: #1890ff; /* 鼠标悬停字体颜色 */
}

.el-menu-item.is-active {
    background-color: #b3e5fc; /* 激活项背景色 */
    color: #1890ff; /* 激活项字体颜色 */
}

.el-icon {
    margin-right: 10px; /* 图标与文字间距 */
}

#placeholder {
    height: 100px;
    width: 100%;
    background-color: #f5f5f5; /* 背景色 */
    border-top: 1px solid #e4e7ed; /* 上边框 */
}
</style>