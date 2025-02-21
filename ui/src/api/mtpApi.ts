export const _deviceInfo =() :string => {
    return '{\n' +
        '    "code": 0,\n' +
        '    "data": [\n' +
        '        {\n' +
        '            "id": 0,\n' +
        // '            "friendlyname": "Device1",\n' +
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
        '            "id": 2,\n' +
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
export const _fileInfo =() :string => {
    return '{\n' +
        '    "code": 0,\n' +
        '    "data": [\n' +
        '        {\n' +
        '            "item_id": 1,\n' +
        '            "parent_id": 0,\n' +
        '            "storage_id": 1,\n' +
        '            "filename": "test1.txt",\n' +
        '            "modificationdate": "2024-11-26T14:30:45",\n' +
        '            "filesize": 123456,\n' +
        '            "filetype": 0\n' +
        '        },\n' +
        '        {\n' +
        '            "item_id": 2,\n' +
        '            "parent_id": 0,\n' +
        '            "storage_id": 1,\n' +
        '            "filename": "test2.txt",\n' +
        '            "modificationdate": "2024-11-26T14:30:45",\n' +
        '            "filesize": 123456,\n' +
        '            "filetype": 0\n' +
        '        },\n' +
        '        {\n' +
        '            "item_id": 3,\n' +
        '            "parent_id": 0,\n' +
        '            "storage_id": 1,\n' +
        '            "filename": "test3.txt",\n' +
        '            "modificationdate": "2024-11-26T14:30:45",\n' +
        '            "filesize": 123456,\n' +
        '            "filetype": 0\n' +
        '        },\n' +
        '        {\n' +
        '            "item_id": 4,\n' +
        '            "parent_id": 0,\n' +
        '            "storage_id": 1,\n' +
        '            "filename": "test4.txt",\n' +
        '            "modificationdate": "2024-11-26T14:30:45",\n' +
        '            "filesize": 123456,\n' +
        '            "filetype": 0\n' +
        '        },\n' +
        '        {\n' +
        '            "item_id": 5,\n' +
        '            "parent_id": 0,\n' +
        '            "storage_id": 1,\n' +
        '            "filename": "test5.txt",\n' +
        '            "modificationdate": "2024-11-26T14:30:45",\n' +
        '            "filesize": 123456,\n' +
        '            "filetype": 0\n' +
        '        }\n' +
        '    ]\n' +
        '}'
}