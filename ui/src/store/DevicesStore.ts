import {defineStore} from 'pinia';
import {Device, File, Storage} from "../js/models";
import {IndexedDB} from "../others/IndexedDB";
import axios from "axios";


export const useDeviceStore = defineStore('device', {
    state: () => ({
        devices: new Map<string, Device>(),
        deviceArray: [] as Array<Device>,
    }),
    actions: {
        initDevicesInfo() {
            axios.get('http://192.168.102.134:3000/devices').then(response => {
                let devices: Device[] = response.data.data;
                this.deviceArray = devices;
                devices.forEach(device => {this.devices.set(device.serialnumber, device);});
                console.log('recovery调用了');
                this.recovery()
            });
        },
        getFiles(deviceIndex: number, storageId: number, parentId: number) {
            let param = {deviceIndex: deviceIndex, storageId: storageId, parentId: parentId};
            axios.get('http://192.168.102.134:3000/files',{params: param}).then(response => {
                let files: File[] = response.data.data;
                let device: Device | undefined = this.deviceArray.find(item => item.index === deviceIndex)
                let storage: Storage | undefined =  device?.storages.find(item => item.id === storageId)
                if(!storage) return
                if(!storage.fileMap) storage.fileMap = new Map<number, File>();
                files.forEach((file: File) => {storage.fileMap.set(file.item_id, file)})
                let pFile: File | undefined = storage.fileMap.get(parentId)
                if(pFile){
                    if(files) pFile.child = files
                    else pFile.child = []
                }
                this.store()
            })
        },
        recovery(): void{
            this.devices.forEach(device => {//root目录，item_id设为-1
                device.storages.forEach(storage => {
                    IndexedDB.getItemAsync(`${device.serialnumber}:${storage.id}`).then(r => {
                        if(r) {
                            let files: File = JSON.parse(r);
                            storage.fileList = files;
                            let map = storage.fileMap
                            this.traverseTree(files.child, map)
                        }else
                            storage.fileList = {item_id: -1, storage_id: storage.id, filename: 'root'} as File; //初始化一个root目录
                    })
                })
            })
        },
        store(): void{
            this.devices.forEach(device => {
                device.storages.forEach(storage => {
                    if (storage.fileList != null) {
                        let json: string = JSON.stringify(storage.fileList);
                        IndexedDB.setItemAsync(`${device.serialnumber}:${storage.id}`, json).then();
                    }
                })
            })
        },
        traverseTree(nodeList: File[], map: any) {
            nodeList.forEach(node => {
                map.set(node.item_id, node);
                if (node.child) this.traverseTree(node.child, map); // 递归访问子节点
            });
        }
        // init(): string | null {
        //     let json: string = _deviceInfo();
        //     try{
        //         let result: Json<Device> = JSON.parse(json);
        //         if (result.code == 0) {
        //             let devices: Device[] = result.data;
        //             this.deviceArray = devices;
        //             devices.forEach(device => {this.devices.set(device.serialnumber, device);});
        //             this.recovery()
        //             return null;
        //         } else
        //             return result.msg;
        //     } catch (error) {
        //         console.error("JSON parsing error:", error);
        //         return "Failed to parse device information.";
        //     }
        // },
        // loadFile(deviceId: number): string | null {
        //     let json: string = _fileInfo();
        //     let result: Json<File> = JSON.parse(json);
        //     if (result.code == 0) {
        //         let files: File[] = result.data;
        //         this.devices.forEach(device => {
        //             if(device.id == deviceId)
        //                 device.storages.forEach(storage => {
        //                     if(storage.id == files[0].storage_id)
        //                         files.forEach(file => {
        //                             if (!storage.files)
        //                                 storage.files = new Map<number, File>
        //                             storage.files.set(file.item_id, file)
        //                         })
        //                 })
        //         })
        //         return null;
        //     } else
        //         return result.msg;
        // },
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
