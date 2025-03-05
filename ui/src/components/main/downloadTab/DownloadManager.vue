<template>
    <div>
        <h2>下载管理</h2>
        <el-table :data="downloads" style="width: 100%">
            <el-table-column prop="name" label="文件名" width="180"></el-table-column>
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
                        size="mini"
                        @click="pauseDownload(row)"
                    >暂停</el-button>
                    <el-button
                        v-if="row.status === 'paused'"
                        type="success"
                        size="mini"
                        @click="resumeDownload(row)"
                    >继续</el-button>
                    <el-button
                        type="danger"
                        size="mini"
                        @click="cancelDownload(row)"
                    >取消</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 下载任务数据
const downloads = ref([
    {
        name: '文件1.zip',
        status: 'downloading', // 状态：downloading, paused, completed
        downloadedBytes: 0, // 已下载字节数
        totalBytes: 100 * 1024 * 1024, // 总字节数（100MB）
        speed: 0, // 下载速度（字节/秒）
        lastUpdateTime: Date.now(), // 上次更新时间
        lastDownloadedBytes: 0, // 上次更新的字节数
    },
    {
        name: '文件2.zip',
        status: 'downloading',
        downloadedBytes: 0,
        totalBytes: 50 * 1024 * 1024, // 50MB
        speed: 0,
        lastUpdateTime: Date.now(),
        lastDownloadedBytes: 0,
    },
    {
        name: '文件3.zip',
        status: 'downloading',
        downloadedBytes: 0,
        totalBytes: 200 * 1024 * 1024, // 200MB
        speed: 0,
        lastUpdateTime: Date.now(),
        lastDownloadedBytes: 0,
    },
]);

// 计算下载进度
const calculateProgress = (row) => {
    return ((row.downloadedBytes / row.totalBytes) * 100).toFixed(2);
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
const updateProgress = () => {
    downloads.value.forEach((download) => {
        if (download.status === 'downloading' && download.downloadedBytes < download.totalBytes) {
            // 模拟下载：每秒增加 1MB
            const newBytes = download.downloadedBytes + 1 * 1024 * 1024;
            download.downloadedBytes = Math.min(newBytes, download.totalBytes);

            // 计算下载速度
            const now = Date.now();
            const timeDiff = (now - download.lastUpdateTime) / 1000; // 时间差（秒）
            const bytesDiff = download.downloadedBytes - download.lastDownloadedBytes; // 字节差
            download.speed = bytesDiff / timeDiff; // 速度（字节/秒）

            // 更新上次记录
            download.lastUpdateTime = now;
            download.lastDownloadedBytes = download.downloadedBytes;

            // 如果下载完成，更新状态
            if (download.downloadedBytes >= download.totalBytes) {
                download.status = 'completed';
                download.speed = 0;
            }
        }
    });

    // 将正在下载的任务移动到最前面
    moveActiveDownloadToTop();
};

// 将正在下载的任务移动到最前面
const moveActiveDownloadToTop = () => {
    const activeDownloads = downloads.value.filter(
        (download) => download.status === 'downloading'
    );
    const otherDownloads = downloads.value.filter(
        (download) => download.status !== 'downloading'
    );
    downloads.value = [...activeDownloads, ...otherDownloads];
};

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

// 取消下载
const cancelDownload = (row) => {
    downloads.value = downloads.value.filter((download) => download !== row);
    ElMessage.success('下载已取消');
};

// 组件挂载时启动定时器
onMounted(() => {
    setInterval(() => {
        updateProgress();
    }, 1000);
});
</script>

<style scoped>
h2 {
    margin-bottom: 20px;
}
</style>