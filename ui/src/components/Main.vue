<script setup>
import Tabs from "./main/Tabs.vue";
</script>

<template>
    <main class="main">
        <Tabs/>
    </main>
</template>

<style scoped>
    .main {
        width: 85%;
        height: 100%;
        float: right;
        background-color: white;
        box-sizing: border-box;
        border: 1px solid gray;
        box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.7);
    }
    p {
        margin: 0;
    }
</style>