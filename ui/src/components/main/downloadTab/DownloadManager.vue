<template>
    <div class="download-manager">
        <el-tabs v-model="activeTab">
            <!-- 未下载/正在下载的任务 -->
            <el-tab-pane label="未完成" name="downloading">
                <el-table :data="downloading" style="width: 100%">
                    <el-table-column prop="name" label="文件名" width="360">
                        <template #default="{ row }: { row: DownloadTask }">
                            <el-link type="primary" @click="showTaskDetail(row)">
                                {{ row.filename }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度">
                        <template #default="{ row }: { row: DownloadTask }">
                            <el-progress :percentage="calculateProgress(row)"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="速度" width="120">
                        <template #default="{ row }: { row: DownloadTask }">
                            {{ formatSpeed(row.speed) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template #default="{ row }: { row: DownloadTask }">
                            <el-tag :type="getStatusTagType(row.status)">
                                {{ row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template #default="{ row }: { row: DownloadTask }">
                            <el-button
                                v-if="row.status === 'running' || row.status === 'waiting'"
                                type="warning"
                                size="small"
                                @click="paused(row.taskId)"
                            >暂停</el-button>
                            <el-button
                                v-if="row.status === 'paused'"
                                type="success"
                                size="small"
                                @click="downloadTask(row)"
                            >继续</el-button>
                            <el-button
                                type="danger"
                                size="small"
                                @click="taskStore.removeTask(row.taskId)"
                            >取消</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <!-- 已完成的任务 -->
            <el-tab-pane label="已完成" name="completed">
                <el-table :data="success" style="width: 100%">
                    <el-table-column prop="name" label="文件名" width="360">
                        <template #default="{ row }: { row: DownloadTask }">
                            <el-link type="primary" @click="showTaskDetail(row)">
                                {{ row.filename }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="进度">
                        <template #default="{ row }: { row: DownloadTask }">
                            <el-progress :percentage="calculateProgress(row)" status="success"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                        <template #default="{ row }: { row: DownloadTask }">
                            <el-tag type="info">
                                {{ row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                        <template #default="{ row }: { row: DownloadTask }">
                            <el-button
                                type="danger"
                                size="small"
                                @click="taskStore.removeTask(row.taskId)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <!-- 任务详情对话框 -->
        <el-dialog
            v-model="detailDialogVisible"
            title="任务详情"
            width="30%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            custom-class="custom-dialog"
        >
            <div v-if="selectedTask" class="dialog-content">
                <p class="detail-item">
                    <span class="label"><strong>文件名：</strong></span>
                    <span class="value">{{ tasks[selectedTask].filename }}</span>
                </p>
                <p class="detail-item">
                    <span class="label"><strong>文件大小：</strong></span>
                    <span class="value">{{ formatBytes(tasks[selectedTask].total) }}</span>
                </p>
                <p class="detail-item">
                    <span class="label"><strong>下载路径：</strong></span>
                    <span class="value">{{ tasks[selectedTask].targetPath }}</span>
                </p>
                <p class="detail-item">
                    <span class="label"><strong>所属设备：</strong></span>
                    <span class="value">{{ device.vendor }}</span>
                </p>
            </div>
        </el-dialog>

    </div>
</template>

<script setup lang="ts">
    import {ref, computed, onMounted, watchEffect} from 'vue';
    import {ElMessage, ElNotification} from "element-plus";
    import {useDownloadTaskStore} from "@/store/DownloadTaskStore.js";
    import {useTabStore} from "@/store/TabStore.js";
    import {useDeviceStore} from "@/store/DevicesStore";
    import {DownloadTask} from "@/js/models";
    import {formatBytes, formatSpeed, getStatusTagType} from "@/js/common";

    const taskStore = useDownloadTaskStore()
    const deviceStore = useDeviceStore();
    const prop = defineProps(['id'])
    const tabStore = useTabStore();

    const activeTab = ref('downloading');    // 当前激活的标签页
    const detailDialogVisible = ref(false);    // 任务详情对话框的显示状态
    const selectedTask = ref<string>('');    // 当前选中的任务

    const data = tabStore.data.find((item:any) => item.tabId === prop.id)
    const tasks = taskStore.tasks
    const device = deviceStore.devices.get(data.serialnumber)

    const categorizedData = computed(() => {
        const result = new Map();

        for (const key in tasks) {
            if (tasks.hasOwnProperty(key) && tasks[key].serialnumber === data.serialnumber) {
                if(!result.has(tasks[key].status))
                    result.set(tasks[key].status, []);
                result.get(tasks[key].status).push(tasks[key]);
            }
        }
        return result;
    });
    // const usbInUse = computed(() => deviceStore.devicesInUse.has(data.serialnumber))
    const success = computed(() => categorizedData.value.get('success') || []);
    const pause = computed(() => categorizedData.value.get('paused') || []);
    const running = computed(() => categorizedData.value.get('running') || []);//正在下载中的任务
    const waiting = computed(() => categorizedData.value.get('waiting') || []);//等待下载的任务

    const downloading = computed(() => [...running.value,...pause.value, ...waiting.value]);//下载中和等待中的任务

    const calculateProgress = (task: DownloadTask) => {//计算进度
        return Number(((task.send / task.total)*100).toFixed(1))
    }
    watchEffect( async () => {//监听下载列表,自动下载
        if(running.value.length === 0 && waiting.value.length > 0)
             await downloadTask(waiting.value);
    });
    // 显示任务详情
    const showTaskDetail = (task : DownloadTask) => {
        selectedTask.value = task.taskId;
        detailDialogVisible.value = true;
    }
    const downloadTask = async (task : DownloadTask) => {
        await taskStore.download(task.taskId);
    }
    const paused = async (taskId : string) => {
        const result = await taskStore.pausedTask(taskId);
    }
</script>

<style scoped>
    .download-manager {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
    }.custom-dialog {
         border-radius: 8px;
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
     }

    .dialog-content {
        padding: 20px;
    }

    .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-size: 14px;
        color: #606266;
    }

    .label {
        font-weight: bold;
        color: #0962ac;
    }

    .value {
        color: #9aa1af;
        text-align: left;
        flex: 1;
        margin-left: 10px;
    }
</style>