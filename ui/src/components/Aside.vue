<script setup>
import Menu from './aside/Menu.vue'
</script>

<template>
    <aside>
        <Menu/>
    </aside>
</template>

<style scoped>
    aside {
        all: unset;
        background-color: #f5f5f5; /* 背景色 */
        margin: 0;
        padding: 0;
        width: 15%;
        height: 100%;
        float: left;
        box-sizing: border-box;

        border: 1px solid gray;
    }
    ul {
        padding: 0;
        margin: 0;
    }
</style>