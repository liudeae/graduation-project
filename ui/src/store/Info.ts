import { defineStore } from 'pinia';
import {Device} from "../models/Device";
import {useUsbBusStore} from "./UsbBus";


// @ts-ignore
export const useInfoStore = defineStore('Info', {
    state: () => ({
        devices: [] as Device[],
    }),
    actions: {

    },
    persist: true,
});
