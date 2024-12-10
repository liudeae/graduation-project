import {File} from "./File";

export interface Storage {
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
}