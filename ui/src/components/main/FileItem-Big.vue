<script setup>
    import {ref} from "vue";

    const name = "word";
    const url = ref(`./src/assets/png/${name}.png`);
    const img = new Image();
    img.src = url.value;

    let height = ref(100);
    let width = ref(100);
    img.onload = () => {
        if (img.height > img.width) {
            width.value = (img.width / img.height) * 100;
            height.value = 100;
        } else {
            height.value = (img.height / img.width) * 100;
            width.value = 100;
        }
    };
</script>

<template>
    <div class="File-file">
        <div class="File-image">
            <el-image :src="url" fit="contain" class="File-image-content" :style="{ width: width + '%', height: height + '%' }"></el-image>
        </div>
        <div class="File-content">
            <span class="File-name">文件名</span>
        </div>
    </div>
</template>

<style scoped>
.File-file {
    margin: 30px;
    width: 100px;
    height: 120px;
    float: left;
    background-color: white;
}
.File-image {
    width: 100%;
    height: 80%;
}
.File-image-content {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
}
.File-content {
    width: 100%;
    height: 20%;
}
</style>