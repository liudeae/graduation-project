export async function deviceInfo(): Promise<string> {
    return new Promise((resolve, reject) => {
        let json: string = _deviceInfo();
        let result = JSON.parse(json);

        if (result.code == 0) return resolve(json);
        else return reject(result.message);
    })
}
function _deviceInfo(): string{
    return '{"code":0,"data":}'
}