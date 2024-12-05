import {File} from "./File";

export class Storage {
    id: number;
    StorageType: number;
    FileSystemType: number;
    AccessCapability: number;
    MaxCapacity: number;
    FreeSpaceInBytes: number;
    FreeSpaceInObjects: number;
    StorageDescription: string;
    VolumeIdentifier: string;
    files: Map<number, File>;

    constructor(id: number, StorageType: number, FileSystemType: number, AccessCapability: number, MaxCapacity: number, FreeSpaceInBytes: number, FreeSpaceInObjects: number, StorageDescription: string, VolumeIdentifier: string) {
        this.id = id;
        this.StorageType = StorageType;
        this.FileSystemType = FileSystemType;
        this.AccessCapability = AccessCapability;
        this.MaxCapacity = MaxCapacity;
        this.FreeSpaceInBytes = FreeSpaceInBytes;
        this.FreeSpaceInObjects = FreeSpaceInObjects;
        this.StorageDescription = StorageDescription;
        this.VolumeIdentifier = VolumeIdentifier;
        this.files = new Map<number, File>();
    }
}