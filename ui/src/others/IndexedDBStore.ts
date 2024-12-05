import {openDB} from "idb";

export class IndexedDBStore {
    static async setItemAsync(key: any, value: any) {
        const db = await openDB('pinia-db', 1, {
            upgrade(db) {
                db.createObjectStore('states');
            },
        });
        await db.put('states', value, key);
    }
    static async getItemAsync(key: any) {
        const db = await openDB('pinia-db', 1);
        return await db.get('states', key);
    }

    static async removeItemAsync(key: any) {
        const db = await openDB('pinia-db', 1);
        await db.delete('states', key);
    }

    static async clearAsync() {
        const db = await openDB('pinia-db', 1);
        await db.clear('states');
    }
    static setItem(key: any, value: any): void {
        this.setItemAsync(key, value).then(r => {});
    }
    static getItem(key: any): any {
        let result
        this.getItemAsync(key).then();
        return result;
    }
    static removeItem(key: any) {
        this.removeItemAsync(key).then(r => {})
    }
    static clear() {
        this.clearAsync().then(() => {});
    }
}