export interface Device {
    index: number;
    friendlyname: string;
    serialnumber: string;
    vendor: string;
    product: string;
    storages: Storage[];
}
export interface Storage {
    id: number;
    StorageType: number;
    FileSystemType: number;
    AccessCapability: number;
    MaxCapacity: number;
    FreeSpaceInBytes: number;
    FreeSpaceInObjects: number;
    StorageDescription: string;
    VolumeIdentifier: string;
    fileMap: Map<number, File>;//用来快速获取files
    fileList: File;
}
export interface File {
    item_id: number
    parent_id: number
    child: File[]
    storage_id: number
    filename: string
    modificationdate: string
    filesize: number
    filetype: number//0:目录
    isDownloaded: boolean//文件：该文件是否下载；目录：该目录下的文件及子目录下的文件是否全部下载完成。
    isLoad: boolean//该目录下的信息是否加载完成
    isLoaded: boolean//该目录下的信息是否加载完成（包括子目录下的全部信息）
}
export interface Json<T>{
    code: number
    data: T[]
    msg: string
}
export interface Tab {
    id: string;
    title: string;
    data: any;
    component: number;
}
export enum componentType {
    FileManager = 0,
    BatchDownload = 1,
}

export interface FileTabData{
    tabId: string;
    deviceSerialnumber: string
    storageId: number
    folderRouter: File[]
    currentFolderId: number
}
export interface BDData{//BatchDownload组件的数据模型
    tabId: string;
    serialnumber: string;
    storageId:number
}


export interface Quest{
    id: number
    filename: string
    targetPath: string
    status: Status
    send:number
    total:number
}
export enum Status {
    NotStarted = 0,
    InProgress = 1,
    Paused = 2,
    Aborted = 3,
    Success = 4
}

