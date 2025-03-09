import {defineStore} from "pinia";

export const useSettingStore = defineStore('Setting', {
    state: () => ({
       ipAddress: "192.168.102.134",
    }),
})