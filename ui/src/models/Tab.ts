import {Component} from "vue";
import {FileBreadcrumbData} from "./FileBreadcrumbData";

export class Tab {
    id: string | number;
    title: string;
    data: FileBreadcrumbData;
    component: Component | string;

    constructor(id: string | number, title: string, data: any, component: Component | string) {
        this.id = id;
        this.title = title;
        this.data = data;
        this.component = component;
    }
}