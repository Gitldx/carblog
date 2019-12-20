import { saveAsyncStorage } from '../common'
import { AsyncStorage } from 'react-native'


const lastParkDataKey = 'lastParkDataKey'

type parkData = {carNumber:string,phone:string}

export function saveLastParkData(last:parkData) {
    saveAsyncStorage(lastParkDataKey, JSON.stringify(last), () => { }, () => { })
}


export async function getLastParkData() {
    const last = await AsyncStorage.getItem(lastParkDataKey)
    return last ? JSON.parse(last) as parkData : null;
}
