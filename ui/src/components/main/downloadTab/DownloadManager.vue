<template>
    <div>
        <h2>下载管理</h2>
        <el-tabs v-model="activeTab">
            <!-- 未下载/正在下载的任务 -->
            <el-tab-pane label="下载中" name="downloading">
                <el-table :data="filteredDownloadingTasks" style="width: 100%">
                    <el-table-column prop="name" label="文件名" width="180">
                        <template #default="{ row }">
                            <el-link type="primary" @click="showTaskDetail(row)">
                                {{ row.name }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度">
                        <template #default="{ row }">
                            <el-progress :percentage="calculateProgress(row)"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="速度" width="120">
                        <template #default="{ row }">
                            {{ formatSpeed(row.speed) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template #default="{ row }">
                            <el-tag :type="getStatusTagType(row.status)">
                                {{ row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template #default="{ row }">
                            <el-button
                                v-if="row.status === 'downloading'"
                                type="warning"
                                size="small"
                                @click="pauseDownload(row)"
                            >暂停</el-button>
                            <el-button
                                v-if="row.status === 'paused'"
                                type="success"
                                size="small"
                                @click="resumeDownload(row)"
                            >继续</el-button>
                            <el-button
                                type="danger"
                                size="small"
                                @click="cancelDownload(row)"
                            >取消</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <!-- 已完成的任务 -->
            <el-tab-pane label="已完成" name="completed">
                <el-table :data="filteredCompletedTasks" style="width: 100%">
                    <el-table-column prop="name" label="文件名" width="180">
                        <template #default="{ row }">
                            <el-link type="primary" @click="showTaskDetail(row)">
                                {{ row.name }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度">
                        <template #default="{ row }">
                            <el-progress :percentage="calculateProgress(row)" status="success"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template #default="{ row }">
                            <el-tag type="info">
                                {{ row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template #default="{ row }">
                            <el-button
                                type="danger"
                                size="small"
                                @click="deleteTask(row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <!-- 任务详情对话框 -->
        <el-dialog v-model="detailDialogVisible" title="任务详情" width="30%">
            <div v-if="selectedTask">
                <p><strong>文件名：</strong>{{ selectedTask.name }}</p>
                <p><strong>文件大小：</strong>{{ formatFileSize(selectedTask.totalBytes) }}</p>
                <p><strong>下载路径：</strong>{{ selectedTask.downloadPath || '默认路径' }}</p>
                <p><strong>下载时间：</strong>{{ selectedTask.downloadTime || '未知' }}</p>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import {ElMessage} from "element-plus";
    import {useDownloadTaskStore} from "@/store/DownloadTaskStore.js";
    import {useTabStore} from "@/store/TabStore.js";

    const taskStore = useDownloadTaskStore()
    const prop = defineProps(['id'])
    const tabStore = useTabStore();

    const activeTab = ref('downloading');    // 当前激活的标签页
    const detailDialogVisible = ref(false);    // 任务详情对话框的显示状态
    const selectedTask = ref(null);    // 当前选中的任务

    const data = tabStore.data.find((item:any) => item.tabId === prop.id)
    const tasks = taskStore.tasks

    const categorizedData = computed(() => {
        const result = new Map();

        for (const key in tasks) {
            if (tasks.hasOwnProperty(key)) {
                if(!result.has(tasks[key].status))
                    result.set(tasks[key].status, []);
                result.get(tasks[key].status).push(tasks[key]);
            }
        }
        return result;
    });
    const success = computed(() => categorizedData.value.get('success') || []);
    const pause = computed(() => categorizedData.value.get('pause') || []);
    const running = computed(() => categorizedData.value.get('running') || []);
    const waiting = computed(() => categorizedData.value.get('waiting') || []);






    // 计算下载进度
    const calculateProgress = (row) => {
        return ((row.downloadedBytes / row.totalBytes) * 100).toFixed(2);
    };

    // 格式化文件大小
    const formatFileSize = (bytes) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        } else if (bytes < 1024 * 1024 * 1024) {
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        }
    };

    // 格式化下载速度
    const formatSpeed = (speed) => {
        if (speed < 1024) {
            return `${speed} B/s`;
        } else if (speed < 1024 * 1024) {
            return `${(speed / 1024).toFixed(2)} KB/s`;
        } else {
            return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`;
        }
    };

    // 获取状态标签的类型
    const getStatusTagType = (status) => {
        switch (status) {
            case 'downloading':
                return 'success';
            case 'paused':
                return 'warning';
            case 'completed':
                return 'info';
            default:
                return 'danger';
        }
    };

    // 更新下载进度
    // const updateProgress = () => {
    //     downloads.value.forEach((download) => {
    //         if (download.status === 'downloading' && download.downloadedBytes < download.totalBytes) {
    //             // 模拟下载：每秒增加 1MB
    //             const newBytes = download.downloadedBytes + 1 * 1024 * 1024;
    //             download.downloadedBytes = Math.min(newBytes, download.totalBytes);
    //
    //             // 计算下载速度
    //             const now = Date.now();
    //             const timeDiff = (now - download.lastUpdateTime) / 1000; // 时间差（秒）
    //             const bytesDiff = download.downloadedBytes - download.lastDownloadedBytes; // 字节差
    //             download.speed = bytesDiff / timeDiff; // 速度（字节/秒）
    //
    //             // 更新上次记录
    //             download.lastUpdateTime = now;
    //             download.lastDownloadedBytes = download.downloadedBytes;
    //
    //             // 如果下载完成，更新状态
    //             if (download.downloadedBytes >= download.totalBytes) {
    //                 download.status = 'completed';
    //                 download.speed = 0;
    //             }
    //         }
    //     });
    // };
    // 暂停下载
    const pauseDownload = (row) => {
        row.status = 'paused';
        row.speed = 0;
    };
    // 继续下载
    const resumeDownload = (row) => {
        row.status = 'downloading';
        row.lastUpdateTime = Date.now(); // 重置更新时间
        row.lastDownloadedBytes = row.downloadedBytes; // 重置上次字节数
    };
    // 显示任务详情
    const showTaskDetail = (row) => {
        selectedTask.value = row;
        detailDialogVisible.value = true;
    };
</script>

<style scoped>
h2 {
    margin-bottom: 20px;
}
</style>