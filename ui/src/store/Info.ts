import { defineStore } from 'pinia';
import {File} from "../models/File";
import {Device} from "../models/Device";


// @ts-ignore
export const useInfoStore = defineStore('Info', {
    state: () => ({
        devices: [] as Device[],
        initialized: false,
    }),
    actions: {

    },
    persist: true,
});
