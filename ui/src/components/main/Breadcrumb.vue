<template>

    <el-scrollbar class="breadcrumb-container">
        <ul class="breadcrumb">
            <li><img src="@/assets/desktop.svg"  alt="home"/></li>
            <li>用户文件夹</li>
            <li>文档</li>
            <li>工作文件</li>
            <li>用户文件夹</li>
            <li>文档</li>
            <li>工作文件</li>
            <li>用户文件夹</li>
            <li>文档</li>
            <li>工作文件</li>
        </ul>
    </el-scrollbar>

</template>

<script lang="ts">

</script>

<style scoped>
.breadcrumb-container {
    height: 34px;
    width: 700px;
    background-color: #f8d4d4;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    border-radius: 10px;
    white-space: nowrap;
    //overflow-x: auto;
    //overflow-y: hidden;
}

.breadcrumb {
    list-style: none;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 5px;
    box-sizing: border-box;
}
.breadcrumb :first-child {
    margin-left: 10px;
}

.breadcrumb li {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.breadcrumb li::after {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background-image: url('src/assets/arrowRight.svg');
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 10px;
}

.breadcrumb li:last-child::after {
    content: ''; /* 最后的路径不显示箭头 */
}
</style>