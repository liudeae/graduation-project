import {defineStore} from "pinia";
import {Tab} from "../models/Tab";
import {File} from "../models/File";
import {FileBreadcrumbData} from "../models/FileBreadcrumbData";

// @ts-ignore
export const useTabInfoStore = defineStore('TabInfo', {
    state: () => ({
        tabs: [] as Array<Tab>,
    }),
    actions: {
        tabsInit() {
            for (let j = 0; j < 4; j++){
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
                this.tabs[j] = new Tab(j, "test"+j, data, '')
            }
        }
    },
    persist: true
});