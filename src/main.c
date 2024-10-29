#include <libmtp.h>
#include <stdio.h>
#include <stdlib.h>
#include <ptp.c>

int main() {
    LIBMTP_Init();
    LIBMTP_mtpdevice_t *device;

    device = LIBMTP_Get_First_Device();
    if (device == NULL){
        printf("No MTP devices found.\n");
        return 1;
    }
     (PTP_USB*)device->usbinfo;
    printf("Connected to device: %s\n",device->usbinfo);


}
