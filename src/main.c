#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>

void print_devices_infomation() {
    LIBMTP_raw_device_t *devices;
    int device_num;

    LIBMTP_error_number_t err = LIBMTP_Detect_Raw_Devices(&devices, &device_num);
    print_error(err);
    for(int i = 0; i < device_num; i++){
        LIBMTP_mtpdevice_t *device;
        char *friendlyname;
        char *serialnumber;

        device = LIBMTP_Open_Raw_Device_Uncached(&devices[i]);
        if (device == NULL) {
            fprintf(stderr, "Unable to open raw device %d\n", i);
            continue;
        }
        friendlyname = LIBMTP_Get_Friendlyname(device);
        serialnumber = LIBMTP_Get_Serialnumber(device);
        if (friendlyname == NULL) {
            printf("Listing File Information on Device with name: (NULL) [SN:%s]\n", serialnumber);
        } else {
            printf("Listing File Information on Device with name: %s [SN:%s]\n",friendlyname, serialnumber);
            free(friendlyname);
        }
        free(serialnumber);
        
    }
}
void print_error(LIBMTP_error_number_t err) {
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
            fprintf(stderr, "mtp-files: Unknown error, please report "
                            "this to the libmtp developers\n");
            return 1;

        /* Successfully connected at least one device, so continue */
        case LIBMTP_ERROR_NONE:
            fprintf(stdout, "mtp-files: Successfully connected\n");
            fflush(stdout);
            break;
    }
}