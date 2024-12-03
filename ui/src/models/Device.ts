import {Storage} from "./Storage";

export class Device {
    id: number;
    friendlyname: string;
    serialnumber: string;
    vendor: string;
    product: string;
    storages: Storage[];

    constructor(id: number, friendlyname: string, serialnumber: string, vendor: string, product: string) {
        this.id = id;
        this.friendlyname = friendlyname;
        this.serialnumber = serialnumber;
        this.vendor = vendor;
        this.product = product;
        this.storages = [];
    }
}