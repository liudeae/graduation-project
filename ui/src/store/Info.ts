import { defineStore } from 'pinia';
import {Device} from "../models/Device";
import {_deviceInfo, _fileInfo} from "../api/mtpApi";
import {Json} from "../models/Json";
import {File} from "../models/File";
import {IndexedDB} from "../others/IndexedDB";


export const useInfoStore = defineStore('Info', {
    state: () => ({
        devices: new Map<string, Device>(),
        deviceArray: [] as Array<Device>,
    }),
    actions: {
        init(): string | null {
            let json: string = _deviceInfo();
            try{
                let result: Json<Device> = JSON.parse(json);
                if (result.code == 0) {
                    let devices: Device[] = result.data;
                    this.deviceArray = devices;
                    devices.forEach(device => {this.devices.set(device.serialnumber, device);});
                    this.recovery()
                    return null;
                } else
                    return result.msg;
            } catch (error) {
                console.error("JSON parsing error:", error);
                return "Failed to parse device information.";
            }
        },
        loadFile(deviceId: number): string | null {
            let json: string = _fileInfo();
            let result: Json<File> = JSON.parse(json);
            if (result.code == 0) {
                let files: File[] = result.data;
                this.devices.forEach(device => {
                    if(device.id == deviceId)
                        device.storages.forEach(storage => {
                            if(storage.id == files[0].storage_id)
                                files.forEach(file => {
                                    if (storage.files == undefined)
                                        storage.files = new Map<number, File>
                                    storage.files.set(file.item_id, file)
                                })
                        })
                })
                return null;
            } else
                return result.msg;
        },
        recovery(): void{
            this.devices.forEach(device => {
                device.storages.forEach(storage => {
                    IndexedDB.getItemAsync(`${device.serialnumber}:${storage.id}`).then(r => {
                        storage.files = new Map<number, File>(JSON.parse(r));
                    })
                })
            })
        },
        store(): void{
            this.devices.forEach(device => {
                device.storages.forEach(storage => {
                    if (storage.files != null) {
                        let json: string = JSON.stringify([...storage.files]);
                        console.log(json);
                        IndexedDB.setItemAsync(`${device.serialnumber}:${storage.id}`, json).then(r => {});
                    }
                })
            })
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
