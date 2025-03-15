# graduation-project
手机数据读取优化方案设计与实现

gcc code.c -o code -lmtp -lcjson
gcc main.c -o main -lmtp
gcc test.c -o test -lmtp -lcjson
./main
pkill -f gvfs-mtp-volume-monitor //暂时关闭gvfs-mtp对设备的占用

sudo chmod -x /usr/libexec/gvfs-mtp-volume-monitor//禁用 gvfs-mtp-volume-monitor
sudo chmod +x /usr/libexec/gvfs-mtp-volume-monitor//恢复

MTP（Media Transfer Protocol）设备存在缓存机制，用于优化文件访问性能和管理设备资源。