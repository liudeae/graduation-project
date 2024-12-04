<template>
    <el-row class="tac">
        <el-col >
            <h3 class="mb-2">Default colors</h3>
            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><list /></el-icon>
                        <span>文件列表</span>
                    </template>
                    <el-menu-item index="1-1">item one</el-menu-item>
                    <el-menu-item index="1-3">item three</el-menu-item>
                    <el-sub-menu index="1-4">
                        <template #title>item four</template>
                        <el-menu-item index="1-4-1">item one</el-menu-item>
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
    import { ref, onBeforeMount  } from 'vue';
    import {deviceInfo} from "@/api/mtpApi";

    const handleOpen = (key: string, keyPath: string[]) => {

    }
    const handleClose = (key: string, keyPath: string[]) => {

    }
    onBeforeMount (async () => {
        let json = await deviceInfo();
        console.log(json);
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