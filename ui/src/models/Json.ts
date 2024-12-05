export class Json<T>{
    code: number
    data: T[]
    msg: string

    constructor(code: number, data: T[], msg: string) {
        this.code = code;
        this.data = data;
        this.msg = msg;
    }
}