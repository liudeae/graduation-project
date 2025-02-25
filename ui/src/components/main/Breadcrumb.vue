<template>
    <el-scrollbar class="breadcrumb-container">
        <ul class="breadcrumb">
            <li><img src="@/assets/desktop.svg"  alt="home" @click="changeFolder(0)"/></li>
            <li v-for="(item,index) in folderRouter" :key="index" @click="changeFolder(item.item_id)">
                <span>{{item.filename}}</span>
            </li>
        </ul>
    </el-scrollbar>
</template>

<script lang="ts" setup>
    import {useTabStore} from "@/store/TabStore";
    import {FileTabData, TabData, File} from "@/js/models";

    const props = defineProps(['id'])
    const tabStore = useTabStore();

    const data = tabStore.data.find((item:TabData) => item.tabId === props.id) as FileTabData
    console.log(data)
    const folderRouter : File[] = data.folderRouter
    console.log(folderRouter)

    const changeFolder = (id : number) => {//展示item_id为id的文件的子文件
        data.currentFolderId = id
        let index = folderRouter.findIndex((item:File) => item.item_id === id);
        if (index !== -1) folderRouter.splice(index + 1);
    }
</script>

<style scoped>
.breadcrumb-container {
    height: 36px;
    width: 700px;
    background-color: white;
    font-family: Arial, sans-serif;
    box-sizing: border-box;
    border-radius: 5px;
    white-space: nowrap;
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2), inset -2px -2px 5px rgba(255, 255, 255, 0.7);
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
.breadcrumb li:last-child{
    margin-right: 10px;
}
.breadcrumb li {
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.breadcrumb li::after {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background-image: url('src/assets/arrowRight.svg');
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 15px;
}
.breadcrumb li:last-child::after {
    background-image: url('src/assets/white.png');
}
.breadcrumb span{
    padding-right: 5px;
    padding-left: 5px;
}
.breadcrumb img {
    padding-right: 2px;
    padding-left: 2px;
}

.breadcrumb span:hover{
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
}
.breadcrumb img:hover{
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
}

</style>