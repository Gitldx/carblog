import { NativeModules, Platform } from "react-native"

const NativeAPI = NativeModules.NativeAPI

type deviceInfo = {systemVersion:string,deviceId:string,systemModel?:string,brand?:string}
export function getDeviceInfo() : deviceInfo{
    const systemVersion = NativeAPI.systemVersion
    const deviceId = NativeAPI.deviceId
    let systemModel = null
    if(Platform.OS == "android"){
        systemModel = NativeAPI.systemModel
    }
    return {systemVersion,deviceId,systemModel}
}