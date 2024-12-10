import {Storage} from "./Storage";

export interface Device {
    id: number;
    friendlyname: string;
    serialnumber: string;
    vendor: string;
    product: string;
    storages: Storage[];
}