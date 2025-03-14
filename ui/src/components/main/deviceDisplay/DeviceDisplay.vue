<template>
    <div class="device-display">
        <el-card class="device-card" v-for="device in devices" :key="device.id">
            <div class="device-header">
                <el-avatar :size="50" :src="getDeviceIcon(device.vendor)" />
                <h2>{{ device.friendlyname }}</h2>
            </div>
            <el-divider />
            <div class="device-details">
                <p><el-icon><User /></el-icon> 序列号: {{ device.serialnumber }}</p>
                <p><el-icon><Briefcase /></el-icon> 厂商: {{ device.vendor }}</p>
                <p><el-icon><Box /></el-icon> 产品: {{ device.product }}</p>
            </div>
            <el-divider />
            <div class="storage-info">
                <h3>存储信息</h3>
                <el-table :data="device.storages" style="width: 100%">
                    <el-table-column prop="StorageDescription" label="描述" />
                    <el-table-column prop="VolumeIdentifier" label="卷标识" />
                    <el-table-column label="最大容量">
                        <template #default="{ row } : {row : Storage}">
                            {{ formatBytes(row.MaxCapacity) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="剩余空间">
                        <template #default="{ row } : {row : Storage}">
                            {{ formatBytes(row.FreeSpaceInBytes) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="FreeSpaceInObjects" label="剩余对象数" />
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
    import {useDeviceStore} from "@/store/DevicesStore";
    import {formatBytes} from "@/js/common";

    const deviceStore = useDeviceStore();
    const devices = deviceStore.deviceArray

    const getDeviceIcon = (vendor: string): string => {
        const icons = {
            'Xiaomi': 'src/assets/xiaomi.jpg',
            'VendorB': '/path/to/vendorB-icon.png',
        };
        return icons[vendor] || '/path/to/default-icon.png';
    }
</script>


<style scoped>
.device-display {
    margin: 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.device-card {
    width: 100%;
    max-width: 600px;
}

.device-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

.device-details {
    margin-bottom: 20px;
}

.storage-info {
    margin-top: 20px;
}
</style>