export interface Device {
    id: number;
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
    children: File[]
    storage_id: number
    filename: string
    modificationdate: string
    filesize: number
    filetype: number
    sourcePath: string
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
export interface DMData{//BatchDownload组件的数据模型
    tabId: string;
    serialnumber: string;
}
export interface DDData{
    tabId: string;
}
export interface DownloadTask {
    taskId: string; // 任务 ID
    send: number; // 已传输的字节数
    total: number; // 文件总字节数
    speed: number; // 下载速度（字节/秒）
    lastUpdated: number; // 上次更新时间戳
    targetPath: string
    status: string
    fileId: number;
    filename: string;
    storageId: number;
    serialnumber: string;
}

// 定义 WebSocket 消息的类型
export interface WebSocketMessage {
    taskId: string;
    send: number;
    total: number;
}

export interface LockOptions {
    timeout?: number;
    priority?: boolean;
}
export interface LockState {
    isLocked: boolean;
    queue: LockRequest[];
}

export interface LockRequest {
    resolve: () => void;
    reject: (reason?: any) => void;
    timeoutId?: number;
    priority: boolean;
}
