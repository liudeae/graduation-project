#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>
#include <cjson/cJSON.h>

#define SUCCESS 0
#define FAILURE 1

int devices_num;
LIBMTP_mtpdevice_t *devices;

char* open_device() {
    LIBMTP_raw_device_t *raw_devices = NULL;
    LIBMTP_error_number_t err = LIBMTP_Detect_Raw_Devices(&raw_devices, &devices_num);
    print_error(err);

    if (devices_num == 0) {
        printf("No devices found.\n");
        free(raw_devices);
        return;
    }

    LIBMTP_mtpdevice_t **device = malloc(devices_num * sizeof(LIBMTP_mtpdevice_t *));
    if (device == NULL) {
        fprintf(stderr, "Memory allocation failed.\n");
        free(raw_devices);
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < devices_num; i++) {
        device[i] = LIBMTP_Open_Raw_Device_Uncached(&raw_devices[i]);

        if (device[i] == NULL) 
            fprintf(stderr, "Failed to open device %d.\n", i);
        else 
            printf("Device %d opened successfully.\n", i);
    }

    cJSON* root = cJSON_CreateObject();
    cJSON* data = cJSON_CreateArray();

    cJSON_AddNumberToObject(root, "code", SUCCESS);
    cJSON_AddArrayToObject(root, data);

    for(int i = 0; i < devices_num; i++) {
        cJSON *device_info = cJSON_CreateObject();
        LIBMTP_mtpdevice_t device = devices[i];

        char *friendlyname = LIBMTP_Get_Friendlyname(&device);
        char *serialnumber = LIBMTP_Get_Friendlyname(&device);
        char *vendor = raw_devices[i].device_entry.vendor;
        char *product = raw_devices[i].device_entry.product;

        cJSON_AddNumberToObject(device_info, "id", i);
        cJSON_AddStringToObject(device_info, "friendlyname", friendlyname);
        cJSON_AddStringToObject(device_info, "serialnumber", serialnumber);
        cJSON_AddStringToObject(device_info, "vendor", vendor);
        cJSON_AddStringToObject(device_info, "product", product);

        LIBMTP_devicestorage_t *storage;
        cJSON* stotages_info = cJSON_CreateArray();
        for(storage = device.storage; storage != 0; storage = storage->next) {
            cJSON* storage_info = cJSON_CreateObject();
            cJSON_AddItemToArray(device_info, storage_info);
            cJSON_AddNumberToObject(storage_info, "id", storage->id);
            cJSON_AddNumberToObject(storage_info, "StorageType", storage->StorageType);
            cJSON_AddNumberToObject(storage_info, "FilesystemType", storage->FilesystemType);
            cJSON_AddNumberToObject(storage_info, "AccessCapability", storage->AccessCapability);
            cJSON_AddNumberToObject(storage_info, "MaxCapacity", storage->MaxCapacity);
            cJSON_AddNumberToObject(storage_info, "FreeSpaceInBytes", storage->FreeSpaceInBytes);
            cJSON_AddNumberToObject(storage_info, "FreeSpaceInObjects", storage->FreeSpaceInObjects);
            cJSON_AddStringToObject(storage_info, "StorageDescription", storage->StorageDescription);
            cJSON_AddStringToObject(storage_info, "VolumeIdentifier", storage->VolumeIdentifier);
        }
        cJSON_AddItemToArray(data, device_info);
    }
    free(raw_devices);
    cJSON_Delete(root);

    char *json = cJSON_Print(root);
    printf("device info: %s", json);
    return json;
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
