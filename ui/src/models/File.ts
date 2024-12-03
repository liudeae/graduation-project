export class File {
    item_id: number
    parent_id: number
    child_id: number[]
    storage_id: number
    filename: string
    modificationdate: string
    filesize: number
    filetype: number

    constructor(item_id: number, parent_id: number, storage_id: number, filename: string, modificationdate: string, filesize: number, filetype: number) {
        this.item_id = item_id;
        this.parent_id = parent_id;
        this.child_id = [];
        this.storage_id = storage_id;
        this.filename = filename;
        this.modificationdate = modificationdate;
        this.filesize = filesize;
        this.filetype = filetype;
    }
}