import {defineStore} from 'pinia';
import {Device, File, Storage} from "../js/models";
import {IndexedDB} from "../others/IndexedDB";
import axios from "axios";
import {reactive} from "vue";


export const useDeviceStore = defineStore('device', {
    state: () => ({
        // devices: reactive(new Map<string, Device>()),
        devices: new Map<string, Device>(),
        deviceArray: [] as Array<Device>,
        devicesInUse: new Set<string>(),//对应设备usb是否使用中
    }),
    actions: {
        async initDevicesInfo() {
            console.log('DeviceStore.initDevicesInfo() running');
            const response = await axios.get('http://9885e40j97.zicp.fun:80/devices');
            console.log('DeviceStore.initDevicesInfo() usb接口获取数据 devices info:', response);

            let devices: Device[] = response.data.data;
            if(response.data.code !== 0)
                throw new Error(`${response.data.msg}`)

            this.deviceArray = devices;
            devices.forEach(device => {
                this.devices.set(device.serialnumber, device);
                device.storages.forEach(storage => {
                    storage.fileMap = new Map<number, File>();
                });
            });
            console.log('DeviceStore.initDevicesInfo() 设备信息初始化完成', this.devices);
            await this.recovery();
        },
        async getFiles(deviceIndex: number, storageId: number, parentId: number) {
            let id = parentId
            if (id === 0) id = -1;
            let param = {deviceIndex: deviceIndex, storageId: storageId, parentId: id};

            console.log('DeviceStore getFiles param:',param);
            const response = await axios.get('http://9885e40j97.zicp.fun:80/files',{params: param});

            console.log('DeviceStore getFiles axios start, response:', response);
            if(response.data.code !== 0)
                throw new Error(`${response.data.msg}`)

            let files: File[] = response.data.data;
            let device: Device | undefined = this.deviceArray.find(item => item.id === deviceIndex)
            let storage: Storage | undefined =  device?.storages.find(item => item.id === storageId)

            let pFile: File | undefined = storage?.fileMap.get(parentId)
            console.log('DeviceStore getFiles 父目录:', pFile);

            if(!pFile)
                throw new Error('父节点未定义！')

            pFile.children.push(...files)
            pFile.isLoad = true
            console.log('DeviceStore getFiles 父目录的child赋值：',pFile.children)

            files.forEach((file: File) => {
                file.children = [] as File[]
                file.sourcePath = `${pFile.sourcePath}/${file.filename}`
                storage?.fileMap.set(file.item_id, file)
            })
            this.store()
        },
        async recovery(){
            console.log('DeviceStore.recovery() running');
            for(let device of this.deviceArray){
                for(let storage of device.storages) {
                    const result = await IndexedDB.getItemAsync(`${device.serialnumber}:${storage.id}`);
                    console.log('DeviceStore.recovery()读取indexedDb信息:',`${device.serialnumber}:${storage.id}`,result)
                    if(result) {
                        console.log('DeviceStore.recovery() indexedDb信息不为空，文件信息恢复')
                        let files: File = JSON.parse(result);
                        storage.fileList = files;
                        storage.fileMap.set(0, files);
                        this.traverseTree(files.children, storage.fileMap)
                        console.log('DeviceStore.recovery() let files: File = JSON.parse(r); files:', files);
                        console.log('DeviceStore.recovery() storage Map：', storage.fileMap);
                    }else{
                        console.log('DeviceStore.recovery() indexedDb信息为空，文件信息初始化')
                        let child: File[] = []
                        //初始化一个root目录
                        let rootName = `${device.vendor || 'unknown'}-${device.product || 'unknown'}`;
                        let sourcePath = '/sdcard'
                        storage.fileList = {item_id: 0, storage_id: storage.id, filename: rootName, children: child, filetype: 0, sourcePath: sourcePath} as File
                        storage.fileMap.set(0, storage.fileList);
                        console.log('DeviceStore.recovery() let files: File = JSON.parse(r); files:', storage.fileList);
                        console.log('DeviceStore.recovery() storageMap：', storage.fileMap);
                    }
                }
            }
            console.log('DeviceStore.recovery() end')
        },
        store(): void{
            console.log('DeviceStore.store() running');
            this.devices.forEach(device => {
                device.storages.forEach(storage => {
                    if (storage.fileList != null) {
                        let json: string = JSON.stringify(storage.fileList);
                        console.log('DeviceStore.store() indexedDB ',`${device.serialnumber}:${storage.id}`,json);
                        IndexedDB.setItemAsync(`${device.serialnumber}:${storage.id}`, json).then();
                    }
                })
            })
            console.log('DeviceStore.store() end');
        },
        traverseTree(nodeList: File[], map: any) {
            nodeList.forEach(node => {
                map.set(node.item_id, node);
                if (node.children) this.traverseTree(node.children, map); // 递归访问子节点
            });
        }
    }
    // persist: {
    //     enable: true,
    //     key: 'key',
    //     serializer: {
    //         serialize: (state: any) => {
    //             return JSON.stringify([...state.devices]);
    //         },
    //         deserialize: (state: any) => {
    //             return new Map<string, number>(JSON.parse(state.devices));
    //         }
    //     },
    // }
});
