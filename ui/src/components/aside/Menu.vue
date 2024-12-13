<template>
    <el-row class="tac">
        <el-col >
<!--            <h3 class="mb-2">Default colors</h3>-->
            <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><list /></el-icon>
                        <span>文件列表</span>
                    </template>
                    <el-sub-menu :index="device.id.toString()" v-for="device in store.deviceArray" :key="device.id">
                        <template #title>{{device.vendor}}</template>
                        <div v-for="storage  in device.storages" :key="storage.id">
                            <el-menu-item :index="device.id+storage.id.toString()">存储{{storage.id}}</el-menu-item>
                        </div>
                    </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2">
                    <el-icon><icon-menu /></el-icon>
                    <span>设备信息</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <el-icon><document /></el-icon>
                    <span>批量下载</span>
                </el-menu-item>
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
    import {Document, Menu,List as IconMenu, Location, Setting, List} from '@element-plus/icons-vue'
    import {onBeforeMount, h, computed, ComputedRef} from 'vue';
    import {useInfoStore} from "@/store/Info";
    import {ElNotification} from "element-plus";

    const handleOpen = (key: string, keyPath: string[]) => {

    }
    const handleClose = (key: string, keyPath: string[]) => {

    }
    const store = useInfoStore();
    const storages =  1;
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