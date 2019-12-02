import { getNodeService } from "./httpService";
import { saveServerParameter, getLocalServerParameter } from "./storage/serverParameter";
import { globalFields } from "../model/global";

declare var global : globalFields


export async function readParameter() {
    try{
        const param : any = await getNodeService("http://129.28.152.138:3000/serverParam")
        const parsed = JSON.parse(param.data)        
        global.serverParam = parsed;
        const diff = (new Date(param.serverTime).getTime() - new Date().getTime())/(1000*60)
        global.serverParam.serverTimeDiff = diff
        saveServerParameter(parsed)
    }
    catch(err){
        const local = await getLocalServerParameter()
        global.serverParam = local
    }

}


export async function getSevertimeDiff(){
    if(!global.serverParam){
        const local = await getLocalServerParameter()
        console.warn(`getSevertimeDiff local:${JSON.stringify(local)}`)
        if(!local){
            return 0
        }
        else{
            const diff : number = local.serverTimeDiff
            return diff ? diff : 0
        }
    }
    else{
        
        return global.serverParam.serverTimeDiff
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