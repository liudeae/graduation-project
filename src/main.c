#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>

void print_devices_infomation();
int print_error(LIBMTP_error_number_t err);
void print_flie_info();

int main() {
    print_devices_infomation();
    return 0;
}

void print_devices_infomation() {
    LIBMTP_raw_device_t *devices;
    int device_num;

    LIBMTP_Init();
    
    LIBMTP_error_number_t err = LIBMTP_Detect_Raw_Devices(&devices, &device_num);
    print_error(err);
    for(int i = 0; i < device_num; i++){
        LIBMTP_mtpdevice_t *device;
        char *friendlyname;
        char *serialnumber;

        char *vendor = devices[i].device_entry.vendor;
        char *product = devices[i].device_entry.product;

        printf("vendor: %s, product: %s\n", vendor, product);

        device = LIBMTP_Open_Raw_Device_Uncached(&devices[i]);
        if (device == NULL) {
            fprintf(stderr, "Unable to open raw device %d\n", i);
            continue;
        }
        friendlyname = LIBMTP_Get_Friendlyname(device);
        serialnumber = LIBMTP_Get_Serialnumber(device);
        if (friendlyname == NULL) {
            printf("Listing File Information on Device with name: (null) [SN:%s]\n", serialnumber);
        } else {
            printf("Listing File Information on Device with name: %s [SN:%s]\n",friendlyname, serialnumber);
            free(friendlyname);
        }
        free(serialnumber);
        LIBMTP_Release_Device(device);
    }
    free(devices);
}
void print_flie_info() {
    LIBMTP_raw_device_t *devices;
    int device_num;

    LIBMTP_error_number_t err = LIBMTP_Detect_Raw_Devices(&devices, &device_num);
    print_error(err);

    for (int i = 0; i < device_num; i++) {
        LIBMTP_mtpdevice_t *device;
        LIBMTP_devicestorage_t *storage;

        device = LIBMTP_Open_Raw_Device(&devices[i]);

        for (storage = device->storage; storage != 0; storage = storage->next) {
            LIBMTP_file_t *files;
            files = LIBMTP_Get_Files_And_Folders(device,storage->id,LIBMTP_FILES_AND_FOLDERS_ROOT);
            
            while (files != NULL) {
                LIBMTP_file_t *tmp;
                printf("File ID: %u\n", files->item_id);
                printf("Parent ID: %u\n", files->parent_id);
                printf("Storage ID: %u\n", files->storage_id);
                printf("File Type: %d\n", files->filetype);
                printf("File Name: %s\n", files->filename);
                printf("File Size: %llu bytes\n", (unsigned long long)files->filesize);
                printf("-----------------------------------\n");
                tmp = files;
                files = files->next;
                LIBMTP_destroy_file_t(tmp);
            }
        }
        LIBMTP_Release_Device(device);
    }
    free(devices);
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