<template>
    <div class="FileManager">
        <Breadcrumb :id="props.id"></Breadcrumb>
        <FileList></FileList>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/main/Breadcrumb.vue";
import FileList from "@/components/main/FileList.vue";

const props = defineProps(['id'])
</script>

<style scoped>
    .FileManager{
        width: 100%;
        height: 100%;
    }
</style>