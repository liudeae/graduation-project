#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>

LIBMTP_raw_device_t *devices;
int devices_num;

LIBMTP_mtpdevice_t *open_device(int index) {
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
        fprintf(stderr, "Error: Storage Id is Illegal\n");

    for(storage = device->storage; storage != 0; storage = storage->next) {
        if (storage->id == id)
            return storage;
    }
    fprintf(stderr, "Error: No storage have been found\n");
}
void print_folders_info(LIBMTP_file_t *files) {
    printf("File ID    Parent ID    File Type     File Name    File Size\n");
    while (files != NULL) {
        LIBMTP_file_t *tmp = files;

        printf("%u    %u    %u    %s    %llu", files->item_id, files->parent_id, files->filetype, 
            files->filename, (unsigned long long)files->filesize);

        files = files->next;
        
        LIBMTP_destroy_file_t(tmp);
    }
}
void print_folders_info(LIBMTP_mtpdevice_t *device, int storage_id, int pid) {
    LIBMTP_file_t *files = LIBMTP_Get_Files_And_Folders(device, storage_id, pid);
    print_folders_info(files);
}
void print_all_files_and_folders(LIBMTP_mtpdevice_t *device, int storage_id, int pid) {
    LIBMTP_file_t *files;
    files = LIBMTP_Get_Files_And_Folders(device,storage_id,pid);
    print_folders_info(files);
    while (files != NULL) {
        LIBMTP_file_t *tmp = files;

        printf("%u    %u    %u    %s    %llu", tmp->item_id, tmp->parent_id, tmp->filetype, 
            tmp->filename, (unsigned long long)tmp->filesize);

        if(tmp->filetype == 0)
            print_all_files_and_folders(device, storage_id, tmp->item_id);
        files = files->next;
        
        LIBMTP_destroy_file_t(tmp);
    }
    
}
void download_all_files(LIBMTP_mtpdevice_t *device, int storage_id, int pid) {
    LIBMTP_file_t *file;
    file = LIBMTP_Get_Files_And_Folders(device,storage_id,pid);
    while (file != NULL) {
        LIBMTP_file_t *tmp = file;

        if(tmp->filetype == 0)
            download_all_files(device, storage_id, tmp->item_id);
        else{
            printf("start download file:%s", tmp->filename);
            LIBMTP_Get_File_To_File(device, tmp->item_id, tmp->filename, NULL, NULL);
            printf("download file:%s success", tmp->filename);
        }
            
        file = file->next;
        
        LIBMTP_destroy_file_t(tmp);
    }
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