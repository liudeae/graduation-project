import {File} from "./File";

export interface FileTabData {
    deviceSerialnumber: string
    storageId: number
    folderRouter: File[]
    files: File[]
}