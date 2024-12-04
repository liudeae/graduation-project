export class File {
    item_id: number
    parent_id: number
    child_id: number[]
    storage_id: number
    filename: string
    modificationdate: string
    filesize: number
    filetype: number//0:目录
    isDownloaded: boolean//文件：该文件是否下载；目录：该目录下的文件及子目录下的文件是否全部下载完成。
    isLoad: boolean//该目录下的信息是否加载完成
    isLoaded: boolean//该目录下的信息是否加载完成（包括子目录下的全部信息）

    constructor(item_id: number, parent_id: number, storage_id: number, filename: string, modificationdate: string, filesize: number, filetype: number) {
        this.item_id = item_id;
        this.parent_id = parent_id;
        this.child_id = [];
        this.storage_id = storage_id;
        this.filename = filename;
        this.modificationdate = modificationdate;
        this.filesize = filesize;
        this.filetype = filetype;
        this.isDownloaded = false
        if (filetype != 0) {
            this.isLoad = true
            this.isLoaded = true
        } else {
            this.isLoad = false
            this.isLoaded = false
        }
    }
}