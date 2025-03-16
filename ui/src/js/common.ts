import {File} from "./models";

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}
export function filterCheckedNode(files:any[])  {
    let filter = [] as File[]
    for(let i = 0; i < files.length; i++) {
        if(files[i].filetype === 0){
            if(files[i].children.find((item:File) => item.item_id === files[i+1].item_id))
                continue
            filter.push(files[i]);
        }else
            filter.push(files[i]);
    }
    return filter;
}    // 格式化下载速度
export function formatSpeed (speed:number)  {
    if (speed < 1024) {
        return `${speed.toFixed(1)} B/s`;
    } else if (speed < 1024 * 1024) {
        return `${(speed / 1024).toFixed(1)} KB/s`;
    } else {
        return `${(speed / (1024 * 1024)).toFixed(1)} MB/s`;
    }
}
export function getStatusTagType (status:string) {
    switch (status) {
        case 'running':
            return 'primary';
        case 'waiting':
            return 'primary';
        case 'paused':
            return 'warning';
        case 'success':
            return 'success';
        default:
            return 'danger';
    }
}