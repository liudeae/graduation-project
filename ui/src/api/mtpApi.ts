import {Device} from "../models/Device";
import {useInfoStore} from "../store/Info";

export async function deviceInfo(): Promise<string | Device> {
    return new Promise((resolve, reject) => {
        let json: string = _deviceInfo();
        let result = JSON.parse(json);
        if (result.code == 0) {
            let store = useInfoStore();
            store.devices = result.data
            return resolve(json);
        }
        else return reject(result.message);
    })
}
function _deviceInfo(): string{
    return '{\n' +
        '    "code": 0,\n' +
        '    "data": [\n' +
        '        {\n' +
        '            "id": 0,\n' +
        '            "friendlyname": "Device1",\n' +
        '            "serialnumber": "123456789",\n' +
        '            "vendor": "Vendor1",\n' +
        '            "product": "Product1",\n' +
        '            "storages": [\n' +
        '                {\n' +
        '                    "id": 1,\n' +
        '                    "StorageType": 2,\n' +
        '                    "FilesystemType": 1,\n' +
        '                    "AccessCapability": 3,\n' +
        '                    "MaxCapacity": 1000000000,\n' +
        '                    "FreeSpaceInBytes": 500000000,\n' +
        '                    "FreeSpaceInObjects": 10000,\n' +
        '                    "StorageDescription": "Main Storage",\n' +
        '                    "VolumeIdentifier": "Volume1"\n' +
        '                }\n' +
        '            ]\n' +
        '        },\n' +
        '        {\n' +
        '            "id": 1,\n' +
        '            "friendlyname": "Device2",\n' +
        '            "serialnumber": "987654321",\n' +
        '            "vendor": "Vendor2",\n' +
        '            "product": "Product2",\n' +
        '            "storages": [\n' +
        '                {\n' +
        '                    "id": 1,\n' +
        '                    "StorageType": 2,\n' +
        '                    "FilesystemType": 2,\n' +
        '                    "AccessCapability": 3,\n' +
        '                    "MaxCapacity": 2000000000,\n' +
        '                    "FreeSpaceInBytes": 1000000000,\n' +
        '                    "FreeSpaceInObjects": 20000,\n' +
        '                    "StorageDescription": "Backup Storage",\n' +
        '                    "VolumeIdentifier": "Volume2"\n' +
        '                }\n' +
        '            ]\n' +
        '        }\n' +
        '    ]\n' +
        '}\n'
}