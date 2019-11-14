import { saveAsyncStorage } from '../common'
import { AsyncStorage } from 'react-native'


const lastBulletinTimeKey = 'lastBulletinTime'

export function saveLastBulletinTime(last) {
    saveAsyncStorage(lastBulletinTimeKey, JSON.stringify(last), () => { }, () => { })
}


export async function getlastBulletinTime() {
    const last = await AsyncStorage.getItem(lastBulletinTimeKey)
    return last ? JSON.parse(last) : 0;
}
