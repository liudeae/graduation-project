import axios from "axios";

export const getDevices =():void => {
    let promise = axios.get('http://192.168.102.134:3000/devices');
}