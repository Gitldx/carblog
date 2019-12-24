import { UserAccount } from "../userAccount/userAccount";
import { UserState } from "../userAccount/userState";

interface serverParam {
    /**服务器时间和手机时间差，精确到分钟即可 */
    serverTimeDiff: number,
    timeSpan: number,
    chatSpan: number,
    nip: string,
    jip: string,

    minversion_a: string,
    minversion_i: string,
    minversion_ja:string,
    minversion_ji:string,
    /**使用downloadservice 强迫下载的最低版本 */
    minForcedversion_a : string,
    apkUrl : string,
}

export interface globalFields {
    networkConnected: boolean,
    timeSpan: number,
    chatSpan: number,
    ip: string,
    user: UserAccount,
    serverParam: serverParam,
    hasInitAppUserState: boolean,
    hasInitOnlineState: boolean,
    userState: UserState,
    hasInitLocalSearchParksKey: boolean,
    hasInitLocalThankParksKey: boolean,
    lastBackPressed: number,
    citycode: number

}

