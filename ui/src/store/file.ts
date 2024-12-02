import { defineStore } from 'pinia';

// @ts-ignore
export const useFileStore = defineStore('file', {
    state: () => ({
        file: new FileInfo(0, null, null, 'root', null, null, 1, null)
    }),
    actions: {
      addChildren: ({ File, state }) => {}
    },
    persist: true,
});
export class FileInfo {
    item_id: number
    parent_id: number
    storage_id: number
    filename: string
    modificationdate: string
    filesize: number
    filetype: number
    children: FileInfo[]

    constructor(item_id: number, parent_id: number, storage_id: number, filename: string
                , modificationdate: string, filesize: number, filetype: number, children: FileInfo[]) {
        this.item_id = item_id;
        this.parent_id = parent_id;
        this.storage_id = storage_id;
        this.filename = filename;
        this.modificationdate = modificationdate;
        this.filesize = filesize;
        this.filetype = filetype;
        this.children = children;
    }
}