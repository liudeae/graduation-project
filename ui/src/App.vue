<script setup>
    import Header from "./components/Header.vue";
    import Aside from "./components/Aside.vue";
    import Main from "./components/Main.vue";
    import {onBeforeMount, ref} from "vue";
    import {useDeviceStore} from "@/store/DevicesStore";

    const isInitialized = ref(false)
    const store = useDeviceStore()
    onBeforeMount(async () => {
        console.log('initialized')
        await store.initDevicesInfo()
        isInitialized.value = true
    })
</script>

<!--<template>-->
<!--    <div id="root">-->
<!--        <Header />-->
<!--        <div class="layout">-->
<!--            <Aside />-->
<!--            <Main />-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->
<template>
    <div id="root">
        <!-- 添加 v-if 控制整体渲染 -->
        <template v-if="isInitialized">
            <Header />
            <div class="layout">
                <Aside />
                <Main />
            </div>
        </template>

        <!-- 初始化未完成时显示 Loading -->
        <div v-else class="loading-container">
            Loading devices information...
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
</style>