<template>
    <el-tree-v2  :data="data" :props="props" show-checkbox class="BD-el-tree">
        <template #default="{ node }">
            <span class="BD-prefix" :class="{ 'is-leaf': node.isLeaf }">
                [ElementPlus]
            </span>
            <div style="display: flex; align-items: center">
                <el-icon v-if="node.type === 0"><Document /></el-icon>
                <el-icon v-else-if="node.type === 1"><Folder /></el-icon>
                <span style="margin-left: 10px">
                    {{ node.label }}
                </span>
            </div>
        </template>
    </el-tree-v2>
</template>

<script lang="ts" setup>
import {Document, Folder} from "@element-plus/icons-vue";

interface Tree {
        id: string
        label: string
        type: number
        children?: Tree[]
    }

    const getKey = (prefix: string, id: number) => {
        return `${prefix}-${id}`
    }

    const createData = (
        maxDeep: number,
        maxChildren: number,
        minNodesNumber: number,
        deep = 1,
        key = 'node'
    ): Tree[] => {
        let id = 0
        return Array.from({ length: minNodesNumber })
            .fill(deep)
            .map(() => {
                const childrenNumber =
                    deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
                const nodeKey = getKey(key, ++id)
                return {
                    id: nodeKey,
                    label: nodeKey,
                    type: 0,
                    children: childrenNumber
                        ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
                        : undefined,
                }
            })
    }

    const props = {
        value: 'id',
        label: 'label',
        children: 'children',
    }
    const data = createData(4, 30, 40)
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
        height: 95%;
        width: 100%;
    }


</style>
