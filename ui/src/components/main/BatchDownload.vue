<template>
    <el-tree  :data="files" :props="props" show-checkbox class="BD-el-tree" :height="600" lazy :load="load">
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
</template>

<script lang="ts" setup>
    import {Document, Folder} from "@element-plus/icons-vue";
    import {useTabStore} from "@/store/TabStore";
    import {useDeviceStore} from "@/store/DevicesStore";
    import {Device, Storage, File} from "@/js/models";
    import {computed} from "vue";
    import type Node from 'element-plus/es/components/tree/src/model/node'

    const prop = defineProps(['id'])
    const tabStore = useTabStore();
    const deviceStore = useDeviceStore()

    const data = tabStore.data.find((item:any) => item.tabId === prop.id)
    const device = deviceStore.deviceArray.find((item:Device) => item.serialnumber === data.serialnumber)
    const storage = device.storages.find((item : Storage) => item.id === data.storageId)

    const files = computed(() => [storage.fileList]);
    console.log('BDownload files:',files);

    const load = async (node: Node, resolve: (data: File[]) => void) => {
        if(node.level === 0){
            resolve(files.value)
        }else{
            console.log('load function triggered, node:', node);
            let itemId = node.data.item_id;
            let currentFile = storage.fileMap.get(itemId)
            if(!currentFile.isLoad)
                await deviceStore.getFiles(device.id, storage.id, itemId);
            const children = storage.fileMap.get(itemId)?.children || [];
            resolve(children);
        }
    };

    const props = {
        value: 'item_id',
        label: 'filename',
        children: 'children',
        isLeaf:(data: File, node: any) => data.filetype !== 0, // filetype !== 0 表示文件（叶子节点）
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
        padding: 10px;
        box-sizing: border-box;
        height: 95%;
        width: 100%;
    }


</style>
