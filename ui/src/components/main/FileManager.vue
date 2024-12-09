<script setup>
import Breadcrumb from "@/components/main/Breadcrumb.vue";
import FileList from "@/components/main/FileList.vue";
</script>

<template>
    <div class="FileManager">
        <Breadcrumb></Breadcrumb>
        <FileList></FileList>
    </div>
</template>

<style scoped>
    .FileManager{
        width: 100%;
        height: 100%;
    }
</style>