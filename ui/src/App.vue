<script setup>

</script>

<template>
    <div id="header"></div>
    <div id="aside"></div>
    <div id="main"></div>
</template>

<style scoped>
    #header {
        position: absolute;
        width: 100%;
        height: 20%;
        background-color: yellow;
        top: 0;
        left: 0;
    }
    #aside {
        position: absolute;
        width: 20%;
        height: 80%;
        background-color: burlywood;
        left: 0;
        top: 20%;
    }
    #main {
        position: absolute;
        width: 80%;
        height: 80%;
        background-color: blue;
        left: 20%;
        top: 20%;
    }
</style>
<style>
    /* 设置全局样式 */
    html, body {
        height: 100%;
        margin: 0;
    }

    #app {
        width: 100%;
        height: 100%; /* 确保 #app 占满视口 */
    }
</style>