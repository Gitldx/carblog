import { NetInfo, ConnectionType } from 'react-native'
import { globalFields } from '../model/global';

declare var global: globalFields

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


export async function getOnlineOfflineAsync(): Promise<boolean> {
    const isConnected = await NetInfo.isConnected.fetch()

    return isConnected
}



export function networkConnected() {
    if (!global.networkConnected) {
        NetInfo.isConnected.fetch().then(flag => {
            global.networkConnected = flag
        })
    }
    return global.networkConnected;
}



export async function getConnectionType(): Promise<ConnectionType> {
    const info = await NetInfo.getConnectionInfo()
    return info.type
}