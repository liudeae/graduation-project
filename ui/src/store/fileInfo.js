import { defineStore } from 'pinia';

export const useFileInfoStore = defineStore('fileInfo', {
    state: () => ({
        fileInfo: [{
            item_id: 1,
            parent_id: 0,
            storage_id: 1,
            filename: 'test',
            modificationdate: '2024.11.19',
            filesize: 10241024,
            filetype: 1,
        },{
            item_id: 2,
            parent_id: 0,
            storage_id: 1,
            filename: 'test1',
            modificationdate: '2024.11.19',
            filesize: 10241,
            filetype: 1,
        }],
    }),
    persist: true,
});