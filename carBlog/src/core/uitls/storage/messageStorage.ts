import { saveAsyncStorage, isEmpty } from "../common";
import { AsyncStorage } from "react-native";
import { ChatMessage, HomeMessage } from "@src/core/model/message.model";



export const unreadMsgKey = 'unreadMsgKey';
export const readMsgKey = 'readMsgKey'
const chatMsgKey = 'c<:>'


function parse(storageStr) {
    let temp = [];
    if (storageStr != null) {
        temp = JSON.parse(storageStr)
    }

    return temp
}


export function saveMsgs(items, key) {

    saveAsyncStorage(key, JSON.stringify(items));

}


export async function getLocalChats(uid) : Promise<ChatMessage[]>{
    const key = chatMsgKey + uid;
    const data = await AsyncStorage.getItem(key)
    const result = parse(data)
    return isEmpty(result) ? [] : result
}


export async function saveChats(uid,items){
    const key = chatMsgKey + uid;
    const localData = await getLocalChats(uid)
    const saved = localData.concat(items) //items.concat(localData);
    // console.warn(`saveChats:${JSON.stringify(saved)}`)
    return await AsyncStorage.setItem(key,JSON.stringify(saved))
}



export async function getLocalMsgs() {
    // getAsyncStorage(key, (result) => {
    //     cb(parse(result))
    // });
    let unreads : HomeMessage[] = await AsyncStorage.getItem(unreadMsgKey) as any
    let reads : HomeMessage[] = await AsyncStorage.getItem(readMsgKey) as any

    if (isEmpty(unreads)) { unreads = [] } else { unreads = parse(unreads) }
    if (isEmpty(reads)) { reads = [] } else { reads = parse(reads) }

    return { unreads, reads }
}


export async function removeOneChat(uid){
    const key = chatMsgKey + uid;
    return await AsyncStorage.removeItem(key)
}


export async function removeAllChats(){
    const keys = await AsyncStorage.getAllKeys()
    keys.forEach(async element => {
        if(element.startsWith(chatMsgKey)){
            const value = await AsyncStorage.getItem(element)
            console.warn(`${element}:${value}`)
             AsyncStorage.removeItem(element)
        }
       
    });

    keys.forEach(async element=>{
        if(element==unreadMsgKey || element == readMsgKey){
            const value = await AsyncStorage.getItem(element)
            console.warn(`${element}:${value}`)
            await AsyncStorage.removeItem(element)
        }
    })
}