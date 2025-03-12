import {defineStore} from "pinia";

export const useSettingStore = defineStore('Setting', {
    state: () => ({
       ipAddress: "192.168.102.134",
        httpPort: "3000",
        wsPort: "8080",
    }),
    actions: {
        downloadURL() {

            return `http://${this.ipAddress}:${this.httpPort}/download`;
        },
        webSocketURL() {
            return `ws://${this.ipAddress}:${this.wsPort}/websocket`;
        },
        deviceInfoURL() {
            return `http://${this.ipAddress}:${this.httpPort}/devices`  ;
        },
        filesURL() {
            return `http://${this.ipAddress}:${this.httpPort}/files`  ;
        }
    }
})