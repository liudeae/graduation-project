export class Tab {
    id: string;
    title: string;
    data: any;
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
    BatchDownload = 1,
}

export interface BDData{//BatchDownload组件的数据模型
    serialnumber: string;
    storageId:number
}