export class Quest{
    id: number
    filename: string
    targetPath: string
    status: Status
    send:number
    total:number

    constructor(id: number, filename: string, targetPath: string, send: number, total: number) {
        this.id = id;
        this.filename = filename;
        this.targetPath = targetPath;
        this.status = Status.NotStarted;
        this.send = send;
        this.total = total;
    }
}
export enum Status {
    NotStarted = 0,
    InProgress = 1,
    Paused = 2,
    Aborted = 3,
    Success = 4
}