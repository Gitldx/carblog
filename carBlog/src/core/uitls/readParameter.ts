import { getNodeService } from "./httpService";
import { saveServerParameter, getLocalServerParameter } from "./storage/serverParameter";
import { globalFields } from "../model/global";

declare var global : globalFields


export async function readParameter() {
    try{
        const param = await getNodeService("http://129.28.152.138:3000/serverParam")
        const parsed = JSON.parse(param.data)
        global.serverParam = parsed;
        saveServerParameter(parsed)
    }
    catch(err){
        const local = await getLocalServerParameter()
        global.serverParam = local
    }

}


export function getLoopTimeSpan() {
    if (!global.serverParam) {
        return 3 * 60 * 1000;
    }
    else {
        return global.serverParam.timeSpan * 1000;
    }
}


export function getLoopChatSpan() {
    if (!global.serverParam) {
        return 30 * 1000;
    }
    else {
        return global.serverParam.chatSpan * 1000;
    }
}


export function getNIP() {
    return "129.28.152.138:3000"
    // return global.serverParam.nip;
}


export function getJIP() {
    return "129.28.152.138:8081"
    // return global.serverParam.jip;
}