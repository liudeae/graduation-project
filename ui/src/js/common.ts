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
            if(files[i].children.find((item:any) => item.item_id === files[i+1].item_id))
                continue
            filter.push(files[i]);
        }else
            filter.push(files[i]);
    }
    return filter;
}