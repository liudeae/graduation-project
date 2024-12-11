import {Component} from "vue";
import {FileBreadcrumbData} from "./FileBreadcrumbData";

export class Tab {
    id: string;
    title: string;
    data: FileBreadcrumbData;
    component: componentType;

    constructor(id: string, title: string, data: any, component: componentType) {
        this.id = id;
        this.title = title;
        this.data = data;
        this.component = component;
    }
}
export enum componentType {
    FileManager = 0,
}