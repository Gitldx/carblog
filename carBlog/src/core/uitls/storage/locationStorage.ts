import { saveAsyncStorage } from '../common'
import { AsyncStorage } from 'react-native'


const lastLocationKey = 'lastLocationKey'
const lastLocatinCityKey = "lastLocatinCityKey"
const searchedShareParksKey = "searchedShareParksKey" 
const thankParksKey = "thankParksKey"
const roadChatKey =  "roadChatKey"

export type LocationStorage = {lng:number,lat:number,time:string}

export function saveLastLocation(loc : LocationStorage) {
    // console.warn(`saveLastLocation:${JSON.stringify(loc)}`)
    saveAsyncStorage(lastLocationKey, JSON.stringify(loc), () => { }, () => { })
}


export async function getLastLocation() {
    const last = await AsyncStorage.getItem(lastLocationKey)
    return last ? JSON.parse(last) : null;
}


export function saveLastCityCode(code:number){
    saveAsyncStorage(lastLocatinCityKey, JSON.stringify(code), () => { }, () => { })
}



export async function getLastLocationCityCode() {
    const last = await AsyncStorage.getItem(lastLocatinCityKey)
    return last ? JSON.parse(last) : null;
}


export function removeCityCode(){
    AsyncStorage.removeItem(lastLocatinCityKey)
}


type searchedSharePark = {id:string,time:Date}

export function saveSearchedShareParks(items : searchedSharePark[]){
    saveAsyncStorage(searchedShareParksKey,JSON.stringify(items),()=>{},()=>{})
}


export async function getSearchedShareParks(){
    const _result  = await AsyncStorage.getItem(searchedShareParksKey)
    const temp : searchedSharePark[] =  _result ? JSON.parse(_result) : []

    return temp.map(t=>{
        return {id:t.id,time:new Date(t.time)}
    })
}




type ThankSharePark = {id:string,time:Date}

export function saveThankParks(items : ThankSharePark[]){
    saveAsyncStorage(thankParksKey,JSON.stringify(items),()=>{},()=>{})
}


export async function getThankParks(){
    const _result  = await AsyncStorage.getItem(thankParksKey)
    const temp : ThankSharePark[] =  _result ? JSON.parse(_result) : []

    return temp.map(t=>{
        return {id:t.id,time:new Date(t.time)}
    })
}



type RoadChat = {road:string,time:Date}

export function saveRoadChat(items : RoadChat[]){
    saveAsyncStorage(roadChatKey,JSON.stringify(items),()=>{},()=>{})
}


export async function getRoadChats(){
    const _result  = await AsyncStorage.getItem(roadChatKey)
    const temp : RoadChat[] =  _result ? JSON.parse(_result) : []

    return temp.map(t=>{
        return {road:t.road,time:new Date(t.time)}
    })
}
