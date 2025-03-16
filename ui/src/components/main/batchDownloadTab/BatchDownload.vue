<template>
    <div>
        <el-input class="batch-download-input" :prefix-icon="Search" clearable v-model="filterText" placeholder="请输入关键词进行过滤">
        </el-input>
        <el-button type="primary" @click="handleDownload" class="batch-download-button">下载选中文件</el-button>
    </div>
    <div class="BD-el-tree">
        <el-tree  :data="files" :props="props" show-checkbox  :height="600" lazy
                  :load="load" :default-expanded-keys="expandedKeys" node-key="item_id"
                  @node-collapse="handleNodeCollapse" ref="treeRef" :filter-node-method="filterNode">
            <template #default="{ node }">
                <span class="BD-prefix" :class="{  'is-leaf': node.data.filetype !== 0  }">
                </span>
                <div style="display: flex; align-items: center">
                    <el-icon v-if="node.data.filetype !== 0"><Document /></el-icon>
                    <el-icon v-else-if="node.data.filetype === 0"><Folder /></el-icon>
                    <span style="margin-left: 10px">
                        {{ node.data.filename }}
                    </span>
                </div>
            </template>
        </el-tree>
    </div>
</template>

<script lang="ts" setup>
    import {Document, Folder, Search} from "@element-plus/icons-vue";
    import {useTabStore} from "@/store/TabStore";
    import {useDeviceStore} from "@/store/DevicesStore";
    import {Device, Storage, File} from "@/js/models";
    import {computed, reactive, ref, watch} from "vue";
    import { ElTree } from 'element-plus'
    import type Node from 'element-plus/es/components/tree/src/model/node'
    import {v4 as uuidv4} from "uuid";
    import {filterCheckedNode} from "@/js/common";
    import {useDownloadTaskStore} from "@/store/DownloadTaskStore";

    const prop = defineProps(['id'])
    const treeRef = ref<InstanceType<typeof ElTree>>()
    const tabStore = useTabStore();
    const deviceStore = useDeviceStore()
    const taskStore = useDownloadTaskStore();

    const filterText = ref<string>("")
    const expandedKeys = ref([])
    const data = tabStore.data.find((item:any) => item.tabId === prop.id)
    const device = deviceStore.deviceArray.find((item:Device) => item.serialnumber === data.serialnumber)
    const storage = device.storages.find((item : Storage) => item.id === data.storageId)

    const files = computed(() => [storage.fileList]);
    console.log('BDownload files:',files);

    watch(filterText, (val) => {
        treeRef.value!.filter(val)
    })
    const load = async (node: Node, resolve: (data: File[]) => void) => {
        console.log('node:',node);
        if(node.level === 0){
            resolve(files.value)
        }else{
            // console.log('load function triggered, node:', node);
            let itemId = node.data.item_id;
            let currentFile = storage.fileMap.get(itemId)
            if(!currentFile.isLoad)
                await deviceStore.getFiles(device.id, storage.id, itemId);
            const children = storage.fileMap.get(itemId)?.children.sort((a, b) => a.filetype - b.filetype) || [];
            resolve(children);
            setTimeout(()=>{
                treeRef.value!.filter(filterText.value);
            }, 200)
        }
        expandedKeys.value = getExpandedKeys(node);
        console.log('this.expandedKeys:',expandedKeys);
    };
    const getExpandedKeys = (node) => {
        const keys = [...expandedKeys.value];
        if (!keys.includes(node.key))
            keys.push(node.key);
        return keys;
    }
    const filterNode = (value: string, data: File) => {
        if (!value) return true
        return data.filename.includes(value)
    }

    const handleNodeCollapse = (data: File, node: Node) => {
        // const key = node.key;
        // expandedKeys.value = expandedKeys.value.filter(k => k !== key);
    }
    const handleDownload = async () => {
        const checkedNodes = treeRef.value?.getCheckedNodes(false, false) || [];
        console.log('checkedNodes:',checkedNodes);
        let filteredFiles = filterCheckedNode(checkedNodes);
        console.log('filteredFiles',filteredFiles);
        await download(filteredFiles)
    }

    const downloadFile = (file: File, parentPath?: string) => {
        if (file.filetype === 0) return
        console.log('下载文件:', file)
        let targetPath: string = parentPath ? `${parentPath}/${file.filename}` : getFullPath(file)
        let task = {taskId: uuidv4(),
            send: 0,
            total: file.filesize,
            speed: 0,
            lastUpdated : Date.now(),
            targetPath: targetPath,
            status: 'paused',
            fileId: file.item_id,
            filename: file.filename,
            storageId: file.storage_id,
            serialnumber: device.serialnumber}
        taskStore.addTask(task)
    }
    const downloadFolder= async (folder: File, parentPath?: string) => {
        if (folder.filetype !== 0) return
        if(folder.isLoad && !folder.children) return
        if(!folder.isLoad) //加载文件夹下面的所有文件信息
            await deviceStore.getFiles(device.id, storage.id, folder.item_id)
        console.log('downloadFolder:',folder)
        let targetPath: string = parentPath ? `${parentPath}/${folder.filename}` : getFullPath(folder)
        for(let file of folder.children){
            if(file.filetype !== 0)
                downloadFile(file, targetPath)
            else
                await downloadFolder(file, targetPath)
        }
    }
    const download = async (files: File[]) => {
        console.log('下载选定的文件:', files)
        // 这里添加批量下载文件的逻辑
        for (let file of files) {
            if(file.filetype !== 0)
                downloadFile(file)
            else
                await downloadFolder(file)
        }
    }
    //todo 重新实现路径获取方法
    const getFullPath = (file: File): string  => {
        const fileMap = storage.fileMap
        const pathSegments: string[] = [];
        let currentFile: File | undefined = file;

        while (currentFile) {
            pathSegments.push(currentFile.filename);
            if (currentFile.item_id === 0) break;
            currentFile = fileMap.get(currentFile.parent_id);
        }
        return pathSegments.reverse().join('/');
    }
    const props = {
        value: 'item_id',
        label: 'filename',
        children: 'children',
        isLeaf:(data: File, node: any) => {
            if(data.isLoad && !data.children)
                return true
            return data.filetype !== 0;
        },
    };
</script>

<style scoped>
    .BD-prefix {
        color: var(--el-color-primary);
        margin-right: 10px;
    }
    .BD-prefix.is-leaf {
        color: var(--el-color-success);
    }
    .BD-el-tree {
        width: 100%;
        height: 100%;
        padding: 10px;
        float: left;
        box-sizing: border-box;
    }
    .batch-download-input {
        width: 400px;
        float: left;
        margin: 10px 20px 10px 10px;
    }
    .batch-download-button{
        margin: 10px 20px 10px 10px;
    }
</style>
