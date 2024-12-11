import {defineStore} from "pinia";
import {componentType, Tab} from "../models/Tab";
import {File} from "../models/File";
import {FileBreadcrumbData} from "../models/FileBreadcrumbData";


// @ts-ignore
export const useTabInfoStore = defineStore('TabInfo', {
    state: () => ({
        tabs: [] as Tab[],
        currentTab: '3' as string,
    }),
    actions: {
        tabsInit() {
            for (let j = 0; j < 3; j++){
                let array: File[] = []
                for(let i = 0; i < 4; i++){
                    array.push(new File(i, 0, 0, "test"+i+j, '', 0
                        , 0, true, true, true));
                }
                let data: FileBreadcrumbData = {
                    storageId: 0,
                    deviceSerialnumber: '1',
                    folderRouter: array
                }
                let id: string = Math.round(new Date().getTime()+j).toString();
                this.tabs.push(new Tab(id, "test"+j, data, componentType.FileManager));
            }
        },
        addTab(tab: Tab): void {
            let timestamp = Math.round(new Date().getTime())+''
            console.log(timestamp)
            this.tabs.push(tab)
        },
        removeTab(id: string): void {
            let tab: Tab | undefined = this.tabs.find(tab => {if (tab.id === id) return tab;})
            if (tab)
                this.tabs.splice(this.tabs.indexOf(tab), 1);
        }
    },
    persist: true
});