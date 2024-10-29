#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>

int main() {
    LIBMTP_Init();
    LIBMTP_mtpdevice_t *device;

    device = LIBMTP_Get_First_Device();
    if (device == NULL){
        printf("No MTP devices found.\n");
        return 1;
    }
    printf("Connected to device: %s\n",device->usbinfo);


}
