import { NetInfo } from 'react-native'
import { globalFields } from '../model/global';

declare var global : globalFields

export function networkListener(callback: () => void) {
    NetInfo.addEventListener(
        'connectionChange',
        callback
    );
}

export function removeNetworkListener(callback: () => void) {
    NetInfo.removeEventListener("connectionChange", callback)
}

export function getOnlineOffline(callback: (isConnected: boolean) => void) {
    NetInfo.isConnected.fetch().then(isConnected => {
        callback(isConnected);
    })
}


export async function getOnlineOfflineAsync() :Promise<boolean> {
    const isConnected = await NetInfo.isConnected.fetch()

    return isConnected
}



export function networkConnected() {
    // if(!global.networkConnected){
    //     global.networkConnected = await NetInfo.isConnected.fetch()
    // }
    return global.networkConnected;
}
