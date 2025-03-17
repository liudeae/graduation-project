export enum Status {
    running,
    waiting,
    paused,
    success,
}
export enum componentType {
    FileManager = 0,
    BatchDownload = 1,
    DownloadManager = 2,
    DeviceDisplay = 3,
}

export const type = {
    folder: 0,
    wav: 1,
    mp3: 2,
    wma: 3,
    ogg: 4,
    audible: 5,
    mp4: 6,
    undef_audio: 7,
    wmv: 8,
    avi: 9,
    mpeg: 10,
    asf: 11,
    qt: 12,
    undef_video: 13,
    jpeg: 14,
    jfif: 15,
    tiff: 16,
    bmp: 17,
    gif: 18,
    pict: 19,
    png: 20,
    vcalendar1: 21,
    vcalendar2: 22,
    vcard2: 23,
    vcard3: 24,
    windowsimageformat: 25,
    winexec: 26,
    text: 27,
    html: 28,
    firmware: 29,
    aac: 30,
    mediacard: 31,
    flac: 32,
    mp2: 33,
    m4a: 34,
    doc: 35,
    xml: 36,
    xls: 37,
    ppt: 38,
    mht: 39,
    jp2: 40,
    jpx: 41,
    album: 42,
    playlist: 43,
    unknown: 44
}

export const typeReverse = Object.fromEntries(
    Object.entries(type).map(([key, value]) => [value, key])
);
