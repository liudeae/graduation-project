<template>
    <div class="FileManager">
        <Breadcrumb :id="props.id"></Breadcrumb>
        <FileList :id="props.id"></FileList>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/main/fileManagerTab/Breadcrumb.vue";
import FileList from "@/components/main/fileManagerTab/FileList.vue";

const props = defineProps(['id'])
</script>

<style scoped>
    .FileManager{
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
    }
</style>