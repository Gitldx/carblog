import { getNodeService } from "./httpService";
import { saveServerParameter, getLocalServerParameter } from "./storage/serverParameter";
import { globalFields, nodeInitData } from "../model/global";
import { UserAccount } from "../userAccount/userAccount";
import { isEmpty } from "./common";

declare var global: globalFields


export async function readParameter() {
    try {
        const url = isEmpty(UserAccount.getUid()) ? "http://129.28.152.138:3000/serverParam" : `http://129.28.152.138:3000/serverParam/${UserAccount.getUid()}`
        const param: any = await getNodeService(url)//A-1
        const parsed: nodeInitData = param
        // console.warn(`param:${JSON.stringify(param)}`)
        parsed.serverParam = JSON.parse(param.serverParam)
        if(parsed.messageData){
            parsed.messageData = param.messageData
        }
        // console.warn(`readParameter:${JSON.stringify(parsed)}`)
        global.serverParam = parsed.serverParam
        const diff = (new Date(param.serverTime).getTime() - new Date().getTime()) / (1000 * 60)
        global.serverParam.serverTimeDiff = diff
        saveServerParameter(parsed.serverParam)
        if (!isEmpty(UserAccount.getUid())) {
            global.nodeInitData = parsed;
        }
        
    }
    catch (err) {
        console.warn(`readParameter:${err}`)
        const local = await getLocalServerParameter()
        global.serverParam = local
    }

}


export async function getSevertimeDiff() {
    if (!global.serverParam) {
        const local = await getLocalServerParameter()
        // console.warn(`getSevertimeDiff local:${JSON.stringify(local)}`)
        if (!local) {
            return 0
        }
        else {
            const diff: number = local.serverTimeDiff
            return diff ? diff : 0
        }
    }
    else {

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