import { saveAsyncStorage } from '../common'
import { AsyncStorage } from 'react-native'


const lastLocationKey = 'lastLocationKey'
const lastLocatinCityKey = "lastLocatinCityKey"

export type LocationStorage = {lng:number,lat:number,time:Date}

export function saveLastLocation(loc : LocationStorage) {
    saveAsyncStorage(lastLocationKey, JSON.stringify(loc), () => { }, () => { })
}


export async function getLastLocation() {
    const last = await AsyncStorage.getItem(lastLocationKey)
    return last ? JSON.parse(last) : null;
}


export function saveLastCityCode(code:string){
    saveAsyncStorage(lastLocatinCityKey, JSON.stringify(code), () => { }, () => { })
}



export async function getLastLocationCityCode() {
    const last = await AsyncStorage.getItem(lastLocatinCityKey)
    return last ? JSON.parse(last) : null;
}