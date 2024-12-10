export interface Quest{
    id: number
    filename: string
    targetPath: string
    status: Status
    send:number
    total:number
}
export enum Status {
    NotStarted = 0,
    InProgress = 1,
    Paused = 2,
    Aborted = 3,
    Success = 4
}