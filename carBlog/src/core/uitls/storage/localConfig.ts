import { saveAsyncStorage } from '../common'
import { AsyncStorage } from 'react-native'


const lastBulletinTimeKey = 'lastBulletinTime'
const UpgradehistoryKey = 'UpgradehistoryKey'

export function saveLastBulletinTime(last) {
    saveAsyncStorage(lastBulletinTimeKey, JSON.stringify(last), () => { }, () => { })
}


export async function getlastBulletinTime() {
    const last = await AsyncStorage.getItem(lastBulletinTimeKey)
    return last ? JSON.parse(last) : 0;
}


export type  Upgradehistory = {version:string,times:string}
export function saveUpgradeHistory(history : Upgradehistory){
    saveAsyncStorage(UpgradehistoryKey,JSON.stringify(history),()=>{},()=>{})
}

export async function getUpgradeHistory(){
    const h = await AsyncStorage.getItem(UpgradehistoryKey)
    return h ? JSON.parse(h) : null
}

export function removeUpgradeHistory(){
    AsyncStorage.removeItem(UpgradehistoryKey)
}
