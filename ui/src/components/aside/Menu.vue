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
                    <el-sub-menu :index="`1-${device.id}`" v-for="device in store.deviceArray" :key="`file-${device.id}`">
                        <template #title>{{device.vendor}}</template>
                        <div v-for="storage  in device.storages" :key="storage.id">
                            <el-menu-item :index="`1-${device.id}-${storage.id}`">存储{{storage.id}}</el-menu-item>
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
                    <el-sub-menu :index="`3-${device.id}`" v-for="device in store.deviceArray" :key="device.id">
                        <template #title>{{device.vendor}}</template>
                        <div v-for="storage  in device.storages" :key="`batch-${device.id}`" @click="addTab(device.serialnumber, storage.id)">
                            <el-menu-item :index="`3-${device.id}-${storage.id}`" @click="">存储{{storage.id}}</el-menu-item>
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
import {onBeforeMount} from 'vue';
import {useInfoStore} from "@/store/Info";
import {ElNotification} from "element-plus";
import {useTabInfoStore} from "@/store/TabInfo";
import {BDData, componentType, Tab} from "@/models/Tab";

// const handleOpen = (key: string, keyPath: string[]) => {
//
//     }
//     const handleClose = (key: string, keyPath: string[]) => {
//
//     }
    const store = useInfoStore();
    const tabInfoStore = useTabInfoStore();
    const addTab = (serialnumber: string, storageId: number) => {
        let id: string = Math.round(new Date().getTime()+Math.round(Math.random()*10)).toString();
        let data:BDData = {serialnumber:serialnumber, storageId: storageId}
        console.log('data',data)
        tabInfoStore.addTab(new Tab(id, '批量下载', data, componentType.BatchDownload))
    }
    onBeforeMount ( () => {
        let result = store.init();
        if (result != null)
            ElNotification.error(result)
    })
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