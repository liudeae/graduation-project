#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <cjson/cJSON.h>
#include <signal.h>
#include <string.h>

#define _FILE_OFFSET_BITS 64
#define SUCCESS 0
#define FAILURE 1

typedef struct {
    FILE *target_file;
    uint64_t current_offset;
    uint64_t resume_offset;
} FileContext;

int devices_num;
//int signal = 0;
LIBMTP_mtpdevice_t **devices = NULL;
FileContext global_file_context = (FileContext){0};
volatile sig_atomic_t download_interrupted  = 0;


uint64_t get_current_offset();
void init();
char* open_device();
char* open_folder(int device_index, int storage_id, int pid);
char* download_file(int device_index, int fid, uint64_t offset, char* path);
int progress(const unsigned long sent, const unsigned long total, const void * const data);
unsigned short put_func(void *params, void *priv, unsigned int sendlen, unsigned char *data, unsigned int *putlen);
int print_error(LIBMTP_error_number_t err);
void handle_signal(int sig);
cJSON* list_files_recursive(LIBMTP_mtpdevice_t *device, uint32_t storage_id, uint32_t parent_id);

int main(int argc, char *argv[]) {

    signal(SIGINT, handle_signal);
    signal(SIGTERM, handle_signal);

    if (argc < 2) {
        fprintf(stderr, "Usage: %s [command] [args...]\n", argv[0]);
        return 1;
    }

    char *command = argv[1];

    if (strcmp(command, "open_device") == 0) {
        char *result = open_device();
        printf("%s\n", result);
        free(result);
    } else if (strcmp(command, "open_folder") == 0) {
        if (argc < 5) {
            fprintf(stderr, "Usage: %s open_folder [device_index] [storage_id] [pid]\n", argv[0]);
            return 1;
        }
        init();
        int device_index = atoi(argv[2]);
        int storage_id = atoi(argv[3]);
        int pid = atoi(argv[4]);
        char *result = open_folder(device_index, storage_id, pid);
        printf("%s\n", result);
        free(result);
    } else if (strcmp(command, "download") == 0) {
        if (argc < 6) {
            fprintf(stderr, "Usage: %s download [device_index] [fid] [offset] [path]\n", argv[0]);
            return 1;
        }
        init();
        int device_index = atoi(argv[2]);
        int fid = atoi(argv[3]);
        uint64_t offset = strtoull(argv[4], NULL, 10);
        char *path = argv[5];
        char *result = download_file(device_index, fid, offset, path);
        printf("%s\n", result);
        free(result);
    } else if (strcmp(command, "list_all_files") == 0) {
        if (argc < 5) {
            fprintf(stderr, "Usage: %s list_all_files [device_index] [storage_id] [pid]\n", argv[0]);
            return 1;
        }
        int device_index = atoi(argv[2]);
        int storage_id = atoi(argv[3]);
        int pid = atoi(argv[4]);
        
        cJSON *root = cJSON_CreateObject();
        if (device_index >= devices_num || !devices[device_index]) {
            cJSON_AddNumberToObject(root, "code", FAILURE);
            cJSON_AddStringToObject(root, "msg", "Invalid device");
        } else {
            cJSON *data = list_files_recursive(devices[device_index], storage_id, pid);
            cJSON_AddNumberToObject(root, "code", SUCCESS);
            cJSON_AddItemToObject(root, "data", data);
        }
        
        char *json = cJSON_Print(root);
        printf("%s\n", json);
        cJSON_Delete(root);
        free(json);
    }else {
        fprintf(stderr, "Unknown command: %s\n", command);
        return 1;
    }

    return 0;
}
void handle_signal(int sig) {
    download_interrupted  = 1;
}
uint64_t get_current_offset() {
    return global_file_context.current_offset;
}
void init() {
    LIBMTP_Init();
    LIBMTP_Set_Debug(2);
    LIBMTP_Set_Debug(LIBMTP_DEBUG_PTP);
    LIBMTP_raw_device_t *raw_devices = NULL;
    LIBMTP_error_number_t err = LIBMTP_Detect_Raw_Devices(&raw_devices, &devices_num);
    print_error(err);

    devices = malloc(devices_num * sizeof(LIBMTP_mtpdevice_t *));
    if (devices == NULL) {
        fprintf(stderr, "Memory allocation failed.\n");
        free(raw_devices);
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < devices_num; i++) {
        devices[i] = LIBMTP_Open_Raw_Device_Uncached(&raw_devices[i]);

        if (devices[i] == NULL) 
            fprintf(stderr, "Failed to open device %d.\n", i);
        else 
            printf("Device %d opened successfully.\n", i);
    }
}
char* open_device() {
    LIBMTP_Init();
    LIBMTP_raw_device_t *raw_devices = NULL;
    LIBMTP_error_number_t err = LIBMTP_Detect_Raw_Devices(&raw_devices, &devices_num);
    print_error(err);

    devices = malloc(devices_num * sizeof(LIBMTP_mtpdevice_t *));
    if (devices == NULL) {
        fprintf(stderr, "Memory allocation failed.\n");
        free(raw_devices);
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < devices_num; i++) {
        devices[i] = LIBMTP_Open_Raw_Device_Uncached(&raw_devices[i]);

        if (devices[i] == NULL) 
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
        LIBMTP_mtpdevice_t *device = devices[i];
        if (device == NULL) {
            continue;
        }


        char *vendor = raw_devices[i].device_entry.vendor;
        char *product = raw_devices[i].device_entry.product;
        char *friendlyname = LIBMTP_Get_Friendlyname(device);
        if (friendlyname == NULL) friendlyname = "";
        char *serialnumber = LIBMTP_Get_Serialnumber(device);
        if (serialnumber == NULL) serialnumber = "";

        cJSON_AddNumberToObject(device_info, "id", i);
        cJSON_AddStringToObject(device_info, "friendlyname", friendlyname);
        cJSON_AddStringToObject(device_info, "serialnumber", serialnumber);
        cJSON_AddStringToObject(device_info, "vendor", vendor);
        cJSON_AddStringToObject(device_info, "product", product);

        LIBMTP_devicestorage_t *storage;
        cJSON* storages_info = cJSON_CreateArray();
        for(storage = device->storage; storage != 0; storage = storage->next) {
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

    char *json = cJSON_Print(root);
    cJSON_Delete(root);

    return json;
}
char *open_folder(int device_index, int storage_id, int pid) {
    LIBMTP_mtpdevice_t *device = devices[device_index];

    LIBMTP_file_t *files = LIBMTP_Get_Files_And_Folders(device, storage_id, pid);
    cJSON* root = cJSON_CreateObject();
    cJSON* data = cJSON_CreateArray();

    cJSON_AddNumberToObject(root, "code", SUCCESS);
    cJSON_AddItemToObject(root, "data",data);
    while (files != NULL) {
        LIBMTP_file_t *tmp = files;
        cJSON *file_info = cJSON_CreateObject();

        struct tm *tm_info = localtime(&tmp->modificationdate);
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

    cJSON_Delete(root);

    return json;
}
cJSON* list_files_recursive(LIBMTP_mtpdevice_t *device, uint32_t storage_id, uint32_t parent_id) {
    cJSON *array = cJSON_CreateArray();
    LIBMTP_file_t *files = LIBMTP_Get_Files_And_Folders(device, storage_id, parent_id);
    LIBMTP_file_t *current = files;

    while (current != NULL) {
        LIBMTP_file_t *next = current->next;

        cJSON *item = cJSON_CreateObject();
        // 添加文件基础信息
        struct tm *tm_info = localtime(&current->modificationdate);
        char date[26];
        strftime(date, sizeof(date), "%Y-%m-%dT%H:%M:%S", tm_info);
        
        cJSON_AddNumberToObject(item, "item_id", current->item_id);
        cJSON_AddStringToObject(item, "filename", current->filename);
        cJSON_AddNumberToObject(item, "filetype", current->filetype);
        cJSON_AddNumberToObject(item, "filesize", current->filesize);
        cJSON_AddStringToObject(item, "modificationdate", date);

        // 递归处理文件夹
        if (current->filetype == LIBMTP_FILETYPE_FOLDER) {
            cJSON *children = list_files_recursive(device, storage_id, current->item_id);
            cJSON_AddItemToObject(item, "children", children);
        }

        cJSON_AddItemToArray(array, item);
        LIBMTP_destroy_file_t(current);
        current = next;
    }
    return array;
}
char *download_file(int device_index, int fid, uint64_t offset, char *path) {

    //LIBMTP_file_t *files = LIBMTP_Get_Files_And_Folders(devices[device_index], 65537, -1);
    download_interrupted = 0;
    // FILE *file = fopen(path, "ab+");
    FILE *file = fopen(path, "rb+"); // 允许读写，不会强制追加
    if (!file) {
        file = fopen(path, "wb+"); // 文件不存在时创建
    }
    if (file == NULL) {
        cJSON* root = cJSON_CreateObject();
        cJSON_AddNumberToObject(root, "code", FAILURE);
        cJSON_AddStringToObject(root, "msg", "Failed to open file");
        char *json = cJSON_Print(root);
        cJSON_Delete(root);
        return json;
    }
    fseek(file, offset, SEEK_SET);

    global_file_context.target_file = file;
    global_file_context.current_offset = 0;
    global_file_context.resume_offset = offset;

    int result = LIBMTP_Get_File_To_Handler(devices[device_index],fid,put_func,&global_file_context,progress,NULL);

    fclose(file);

    cJSON* root = cJSON_CreateObject();
    if(result == 0) {
        cJSON_AddNumberToObject(root, "code", SUCCESS);
        cJSON_AddStringToObject(root, "msg", "success");
    } else {
        cJSON_AddNumberToObject(root, "code", FAILURE);
        cJSON_AddStringToObject(root, "msg", "failed");
    }
    char *json = cJSON_Print(root);
    cJSON_Delete(root);
    return json;

}
int progress(const unsigned long sent, const unsigned long total, const void * const data){
    global_file_context.current_offset = sent;
    // 使用换行符结尾并立即刷新缓冲区
    fprintf(stdout, "PROGRESS:%lu,%lu\n", sent, total);
    fflush(stdout); // 确保立即输出
    return download_interrupted;
}
unsigned short put_func(void *params, void *priv, unsigned int sendlen, unsigned char *data, unsigned int *putlen) {
    FileContext *ctx = (FileContext *)priv;

    printf("put_fun start...\n");
    fflush(stdout);
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

