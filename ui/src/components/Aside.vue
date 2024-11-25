<script setup>
import Menu from './Menu.vue'
</script>

<template>
    <aside class="aside">
        <Menu/>
    </aside>
</template>

<style scoped>
    .aside {
        all: unset;
        background-color: white;
        margin: 0;
        padding: 0;
        width: 20%;
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