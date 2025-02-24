import {File} from "./File";

export interface FileTabData {
    deviceSerialnumber: string
    storageId: number
    folderRouter: File[]
    files: File[]
}
export interface TabFileData {
    deviceSerialnumber: string
    storageId: number
    folderRouter: File[]
    currentFolderId: number
}