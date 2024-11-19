<script setup>
    import Header from "./components/Header.vue";
    import Aside from "./components/Aside.vue";
    import Main from "./components/Main.vue";

</script>

<template>
    <div id="root">
        <Header />
        <div class="layout">
            <Aside />
            <Main />
        </div>
    </div>
</template>

<style scoped>
    #root {
        width: 100%;
        height: 100%;
    }
    .layout{
        width: 100%;
        height: 85%;
    }
</style>