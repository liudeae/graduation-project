async function deviceInfo(): Promise<string> {
    return new Promise((resolve, reject) => {
        let json = _deviceInfo();
        let result = JSON.parse(json);
        if (result.code == 0)
            return resolve(result);
        else
            return reject(result.message);
    })
}
function _deviceInfo(): string{
    return ''
}