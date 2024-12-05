import { defineStore } from 'pinia';
import {Device} from "../models/Device";
import {_deviceInfo, _fileInfo} from "../api/mtpApi";
import {Json} from "../models/Json";
import {File} from "../models/File";


// @ts-ignore
export const useInfoStore = defineStore('Info', {
    state: () => ({
        devices: new Map<string, Device>(),
    }),
    actions: {
        init(): string | null {
            let json: string = _deviceInfo();
            try{
                let result: Json<Device> = JSON.parse(json);
                if (result.code == 0) {
                    let devices: Device[] = result.data;
                    devices.forEach(device => {this.devices.set(device.serialnumber, device);});
                    return null;
                } else
                    return result.msg;
            } catch (error) {
                console.error("JSON parsing error:", error);
                return "Failed to parse device information.";
            }
        },
        loadFile(): string | null {
            let json: string = _fileInfo();
            let result: Json<File> = JSON.parse(json);
            if (result.code == 0) {
                let files: File[] = result.data;
                return null;
            } else
                return result.msg;
        }
    },
    persist: {
        enable: true,
        key: 'key',
        serializer: {
            serialize: (state: any) => {
                return JSON.stringify([...state.devices]);
            },
            deserialize: (state: any) => {
                return new Map<string, number>(JSON.parse(state.devices));
            }
        },
    }
});
