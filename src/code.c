#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>

LIBMTP_mtpdevice_t *open_device(int index) {
    LIBMTP_raw_device_t *devices;
    int devices_num;

    LIBMTP_error_number_t err = LIBMTP_Detect_Raw_Devices(&devices, &devices_num);
    print_error(err);
    if(index >= devices_num)
        fprintf(stderr, "Error: Device index %d out of range. Only %d devices available.\n", index, devices_num);
    return LIBMTP_Open_Raw_Device_Uncached(&devices[index]);
}
void print_storages(LIBMTP_mtpdevice_t *device) {
    LIBMTP_devicestorage_t *storage;

    printf("id    StorageType    AccessCapability    MaxCapacity    StorageDescription    VolumeIdentifier\n");
    for(storage = device->storage; storage != 0; storage = storage->next) {
        printf("%u    %u    %u    %u    %s    %s\n", storage->id, storage->StorageType
        , storage->AccessCapability, storage->MaxCapacity, storage->StorageDescription, storage->VolumeIdentifier);
    }
}
LIBMTP_devicestorage_t *open_storage(LIBMTP_mtpdevice_t *device, int id) {
    LIBMTP_devicestorage_t *storage;

    if (id < 0) 
        fprintf(stderr, "Error: storage id can not be negative\n");

    for(storage = device->storage; storage != 0; storage = storage->next) {
        if (storage->id == id)
            return storage;
    }
    fprintf(stderr, "Error: on storage have been found\n");
}

int print_error(LIBMTP_error_number_t err) {
    switch(err)
    {
        case LIBMTP_ERROR_NO_DEVICE_ATTACHED:
            fprintf(stdout, "mtp-files: No Devices have been found\n");
            return 0;
        case LIBMTP_ERROR_CONNECTING:
            fprintf(stderr, "mtp-files: There has been an error connecting. Exit\n");
            return 1;
        case LIBMTP_ERROR_MEMORY_ALLOCATION:
            fprintf(stderr, "mtp-files: Memory Allocation Error. Exit\n");
            return 1;
        /* Unknown general errors - This should never execute */
        case LIBMTP_ERROR_GENERAL:
        default:
            fprintf(stderr, "mtp-files: Unknown error, please report this to the libmtp developers\n");
            return 1;

        /* Successfully connected at least one device, so continue */
        case LIBMTP_ERROR_NONE:
            fprintf(stdout, "mtp-files: Successfully connected\n");
            fflush(stdout);
            break;
    }
}