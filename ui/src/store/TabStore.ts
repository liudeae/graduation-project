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
        addTab(title: string, data: any, component: number, onlyOne = false): void {
            if(onlyOne){
                const find: Tab | undefined = this.tabs.find(item => item.component === component);
                if(find){
                    this.currentTab = find.id;
                    return;
                }
            }
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
    },
    getters: {},
    persist: true
});