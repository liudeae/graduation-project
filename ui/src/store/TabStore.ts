import {defineStore} from "pinia";
import {Tab} from "../js/models";


// @ts-ignore
export const useTabStore = defineStore('Tab', {
    state: () => ({
        tabs: [] as Tab[],
        currentTab: '3' as string,
        data: [] as any[]
    }),
    actions: {
        addTab(title: string, data: any, component: number): void {
            let id: string = Math.round(new Date().getTime()+Math.round(Math.random()*10)).toString();
            data.tabId = id;
            let tab : Tab = {id: id, data: data, component: component, title: title};
            this.data.push(data);
            this.tabs.push(tab)
            this.currentTab = id;
        },
        removeTab(id: string): void {
            this.tabs = this.tabs.filter(tab => tab.id !== id)
            this.data = this.data.filter(item => item.tabId !== id)
        },
        // fileList(id: string, pid: number = 0): void{
        //     let data: FileTabData | undefined = this.tabs.find(tab => tab.id === id)?.data
        //     const store = useInfoStore();
        //     if(!data) return;
        //     let files: Map<number,File> | undefined = store.devices.get(data.deviceSerialnumber)
        //         ?.storages.find(item => item.id == data?.storageId)?.files
        //     console.log('fileList:', files)
        //     if(!files) return;
        //     data.files = []
        //     files.forEach(file => {if (file.parent_id == pid) data.files.push(file)})
        // }
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
        // addTab(tab: Tab): void {
        //     this.data.push(tab.data);
        //     this.tabs.push(tab)
        // },
    },
    getters: {},
    persist: true
});