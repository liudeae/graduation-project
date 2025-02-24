import {defineStore} from "pinia";
import {componentType, Tab} from "../models/Tab";
import {File} from "../models/File";
import {FileTabData, TabFileData} from "../models/FileTabData";
import {useDeviceStore} from "./DevicesStore";


// @ts-ignore
export const useTabInfoStore = defineStore('TabInfo', {
    state: () => ({
        tabs: [] as Tab[],
        currentTab: '3' as string,
    }),
    actions: {
        addTab(tab: Tab): void {
            this.tabs.push(tab)
        },
        removeTab(id: string): void {
            this.tabs = this.tabs.filter(tab => tab.id !== id)
        },
        // fileList(id: string, pid: number = 0): void{
        //     let data: FileTabData | undefined = this.tabs.find(tab => tab.id === id)?.data
        //     const store = useDeviceStore();
        //     if(!data) return;
        //     let files = store.devices.get(data.deviceSerialnumber)
        //         ?.storages.find(item => item.id == data?.storageId)?.fileMap
        //     let device = store.devices.get(data.deviceSerialnumber)
        //     let storage =
        //     console.log('fileList:', files)
        //     if(!files) return;
        //     data.files = []
        //     files.forEach(file => {if (file.parent_id == pid) data.files.push(file)})
        // }
    },
    getters: {},
    persist: true
});
// tabsInit() {
//     for (let j = 0; j < 3; j++){
//         let array: File[] = []
//         for(let i = 0; i < 5; i++){
//             array.push(new File(i, 0, 0, "test"+i+j, '', 0
//                 , 0, true, true, true));
//         }
//         let data: FileTabData = {
//             storageId: 1,
//             deviceSerialnumber: '123456789',
//             folderRouter: array,
//             files: []
//         }
//         let id: string = Math.round(new Date().getTime()+j).toString();
//         this.tabs.push(new Tab(id, "test"+j, data, componentType.FileManager));
//     }
// },