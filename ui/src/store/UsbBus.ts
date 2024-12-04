import { defineStore } from 'pinia';
import {Quest} from "../models/Quest";

// @ts-ignore
export const useUsbBusStore = defineStore('UsbBus', {
    state: () => ({
        isAvailable: true as boolean,
        waitQueue: [] as number[],
        questList: [] as Quest[],
    }),
    actions: {
    },
    persist: true,
});
