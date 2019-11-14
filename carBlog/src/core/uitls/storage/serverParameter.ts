import { saveAsyncStorage } from '../common'
import {AsyncStorage} from 'react-native'




const key = 'serverParameterKey'

export function saveServerParameter(serverParameter){
    saveAsyncStorage(key,JSON.stringify(serverParameter),()=>{},()=>{})
}


export async function getLocalServerParameter(){
    const serverParameter = await AsyncStorage.getItem(key)
    return JSON.parse(serverParameter)
}

