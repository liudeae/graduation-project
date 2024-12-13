#ifdef __cplusplus
extern "C" {
#endif

#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <cjson/cJSON.h>

#define _FILE_OFFSET_BITS 64
#define SUCCESS 0
#define FAILURE 1

typedef struct {
    FILE *target_file;
    uint64_t current_offset;
    uint64_t resume_offset;
} FileContext;

extern int devices_num;
extern int signal;
extern LIBMTP_mtpdevice_t *devices;

// 函数声明
char* open_device();
char* open_folder(int device_index, int storage_id, int pid);
char* download_file(int device_index, int fid, uint64_t offset, char* path);
int progress(uint64_t sent, uint64_t total, void* data);

#ifdef __cplusplus
}
#endif

char* open_device() {
    LIBMTP_Init();
    LIBMTP_raw_device_t *raw_devices = NULL;
    LIBMTP_error_number_t err = LIBMTP_Detect_Raw_Devices(&raw_devices, &devices_num);
    print_error(err);

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
    cJSON_AddItemToObject(root, "data",data);

    for(int i = 0; i < devices_num; i++) {
        cJSON *device_info = cJSON_CreateObject();
        LIBMTP_mtpdevice_t device = devices[i];

        char *friendlyname = LIBMTP_Get_Friendlyname(&device);
        char *serialnumber = LIBMTP_Get_Serialnumber(&device);
        char *vendor = raw_devices[i].device_entry.vendor;
        char *product = raw_devices[i].device_entry.product;

        cJSON_AddNumberToObject(device_info, "id", i);
        cJSON_AddStringToObject(device_info, "friendlyname", friendlyname);
        cJSON_AddStringToObject(device_info, "serialnumber", serialnumber);
        cJSON_AddStringToObject(device_info, "vendor", vendor);
        cJSON_AddStringToObject(device_info, "product", product);

        LIBMTP_devicestorage_t *storage;
        cJSON* storages_info = cJSON_CreateArray();
        for(storage = device.storage; storage != 0; storage = storage->next) {
            cJSON* storage_info = cJSON_CreateObject();

            cJSON_AddNumberToObject(storage_info, "id", storage->id);
            cJSON_AddNumberToObject(storage_info, "StorageType", storage->StorageType);
            cJSON_AddNumberToObject(storage_info, "FilesystemType", storage->FilesystemType);
            cJSON_AddNumberToObject(storage_info, "AccessCapability", storage->AccessCapability);
            cJSON_AddNumberToObject(storage_info, "MaxCapacity", storage->MaxCapacity);
            cJSON_AddNumberToObject(storage_info, "FreeSpaceInBytes", storage->FreeSpaceInBytes);
            cJSON_AddNumberToObject(storage_info, "FreeSpaceInObjects", storage->FreeSpaceInObjects);
            cJSON_AddStringToObject(storage_info, "StorageDescription", storage->StorageDescription);
            cJSON_AddStringToObject(storage_info, "VolumeIdentifier", storage->VolumeIdentifier);

            cJSON_AddItemToArray(storages_info, storage_info);
        }
        cJSON_AddItemToObject(device_info, "storages",storages_info);
        cJSON_AddItemToArray(data, device_info);
    }
    free(raw_devices);
    cJSON_Delete(root);

    char *json = cJSON_Print(root);
    printf("device info: %s", json);
    return json;
}
char *open_folder(int device_index, int storage_id, int pid) {
    LIBMTP_file_t *files = LIBMTP_Get_Files_And_Folders(&devices[device_index], storage_id, pid);

    cJSON* root = cJSON_CreateObject();
    cJSON* data = cJSON_CreateArray();

    cJSON_AddNumberToObject(root, "code", SUCCESS);
    cJSON_AddItemToObject(root, "data",data);
    while (files != NULL) {
        LIBMTP_file_t *tmp = files;
        cJSON *file_info = cJSON_CreateObject();

        struct tm *tm_info = localtime(tmp->modificationdate);
        char date[26];
        strftime(date, sizeof(date), "%Y-%m-%dT%H:%M:%S", tm_info);

        cJSON_AddNumberToObject(file_info, "item_id", tmp->item_id);
        cJSON_AddNumberToObject(file_info, "parent_id", tmp->parent_id);
        cJSON_AddNumberToObject(file_info, "storage_id", tmp->storage_id);
        cJSON_AddStringToObject(file_info, "filename", tmp->filename);
        cJSON_AddStringToObject(file_info, "modificationdate", date);
        cJSON_AddNumberToObject(file_info, "filesize", tmp->filesize);
        cJSON_AddNumberToObject(file_info, "filetype", tmp->filetype);

        cJSON_AddItemToArray(data, file_info);
        files = files->next;
        LIBMTP_destroy_file_t(tmp);
    }
    char *json = cJSON_Print(root);
    printf("files info: %s", json);

    cJSON_Delete(root);

    return json;
}
char *downlaod_file(int device_index, int fid, uint64_t offset, char *path) {
    FILE *file = fopen(path, "ab+");
    fseek(file, offset, SEEK_END);

    FileContext ctx;
    ctx.current_offset = 0;
    ctx.resume_offset = offset;
    ctx.target_file = file;

    int result = LIBMTP_Get_File_To_Handler(&devices[device_index],fid,put_func,&ctx,progress,NULL);

    cJSON* root = cJSON_CreateObject();
    if(result == 0) {
        cJSON_AddNumberToObject(root, "code", SUCCESS);
        cJSON_AddStringToObject(root, "smg", "suceess");
    } else {
        cJSON_AddNumberToObject(root, "code", FAILURE);
        cJSON_AddStringToObject(root, "smg", "failed");
    }
    char *json = cJSON_Print(root);
    return json;

}
int progress(uint64_t sent, uint64_t total, void *data) {
    
    return 0;
}
int put_func(void *params, void *priv, uint32_t sendlen, unsigned char *data, uint32_t *putlen) {
    FileContext *ctx = (FileContext *)priv;

    if (ctx->current_offset < ctx->resume_offset) {
        uint64_t remaining_skip = ctx->resume_offset - ctx->current_offset;
        if (remaining_skip >= sendlen) {
            *putlen = sendlen;
            ctx->current_offset += sendlen;
            return LIBMTP_HANDLER_RETURN_OK;
        } else {
            data += remaining_skip;
            sendlen -= remaining_skip;
            ctx->current_offset = ctx->resume_offset;
        }
    }

    size_t written = fwrite(data, 1, sendlen, ctx->target_file);
    if (written < sendlen) {
        perror("Error writing to file");
        return LIBMTP_HANDLER_RETURN_ERROR;
    }

    ctx->current_offset += written;
    *putlen = (uint32_t)written;

    return LIBMTP_HANDLER_RETURN_OK;
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
