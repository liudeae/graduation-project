<script setup>
    import Header from "./components/Header.vue";
    import Aside from "./components/Aside.vue";
    import Main from "./components/Main.vue";
    import { onBeforeMount, ref } from "vue";
    import { useDeviceStore } from "@/store/DevicesStore";
    import { ElLoading, ElMessage } from "element-plus";
    import { Loading } from '@element-plus/icons-vue'

    const isInitialized = ref(false); // 初始化是否完成
    const isError = ref(false); // 是否加载失败
    const isLoading = ref(false); // 是否正在加载

    const store = useDeviceStore();

    // 初始化设备信息
    const initializeDevices = async () => {
        isLoading.value = true;
        isError.value = false;

        const loadingInstance = ElLoading.service({
            lock: true,
            background: "rgba(0, 0, 0, 0.7)",
            text: "正在加载设备信息...",
        });

        try {
            await store.initDevicesInfo();
            isInitialized.value = true;
        } catch (error) {
            console.error("Failed to initialize devices:", error);
            isError.value = true; // 标记加载失败
        } finally {
            loadingInstance.close();
            isLoading.value = false;
        }
    };

    // 重试初始化
    const retryInitialize = () => {
        initializeDevices();
    };

    onBeforeMount(() => {
        initializeDevices();
    });
</script>

<template>
    <div id="root">
        <!-- 初始化完成后渲染内容 -->
        <template v-if="isInitialized">
            <Header />
            <div class="layout">
                <Aside />
                <Main />
            </div>
        </template>

        <!-- 加载失败时显示错误页面 -->
        <div v-else-if="isError" class="error-container">
            <div class="error-content">
                <h2>哎呀！出了点问题。</h2>
                <p>未能加载设备信息。请检查您的网络连接，然后重试。</p>
                <el-button type="primary" @click="retryInitialize">重试</el-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #root {
        width: 100%;
        height: 100%;
    }
    #root .layout{
        width: 100%;
        height: 85%;
    }
    .loading-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
    }

    .loading-icon {
        font-size: 40px;
        margin-bottom: 16px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .error-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
    }

    .error-content {
        text-align: center;
        max-width: 400px;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .error-content h2 {
        color: #f56c6c;
        margin-bottom: 16px;
    }

    .error-content p {
        color: #666;
        margin-bottom: 24px;
    }
</style>