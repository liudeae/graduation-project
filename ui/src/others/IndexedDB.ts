import {openDB} from "idb";

export class IndexedDB {
    static async setItemAsync(key: any, value: any) {
        const db = await openDB('pinia-db', 1, {
            upgrade(db) {
                db.createObjectStore('states');
            },
        });
        const item = {
            value: value,
            expiry: Date.now() + 24 * 60 * 60 * 1000,
        };

        await db.put('states', item, key);
    }
    static async getItemAsync(key: any) {
        const db = await openDB('pinia-db', 1, {
            upgrade(db) {
                db.createObjectStore('states');
            },
        });

        const item = await db.get('states', key);
        if (!item)
            return null;
        if (Date.now() > item.expiry) {
            await db.delete('states', key);
            return null;
        }
        return item.value;
    }

    static async removeItemAsync(key: any) {
        const db = await openDB('pinia-db', 1);
        await db.delete('states', key);
    }

    static async clearAsync() {
        const db = await openDB('pinia-db', 1);
        await db.clear('states');
    }
}