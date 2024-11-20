<script setup>
import {ref} from "vue";

const svgPath = ref('');

async function getSvgPath(name) {
    const module = await import(`file-icon-vectors/dist/vivid/${name}.svg`);
    svgPath.value = module.default;
    return svgPath.value;
}
getSvgPath('3g2');
</script>

<template>
    <div class="file">
        <div class="image">
            <el-image :src="svgPath" fit="contain"></el-image>
        </div>
        <div class="content">
            <span class="name">文件名</span>
        </div>
    </div>
</template>

<style scoped>
    .file {
        margin: 5px;
        width: 150px;
        height: 200px;
        float: left;
        background-color: red;
    }
    .image {
        width: 100%;
        height: 50%;
    }
    .content {
        width: 100%;
        height: 50%;
    }
</style>