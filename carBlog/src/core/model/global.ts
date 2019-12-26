import { UserAccount } from "../userAccount/userAccount";
import { UserState } from "../userAccount/userState";

interface serverParam {
    /**服务器时间和手机时间差，精确到分钟即可 */
    serverTimeDiff: number,
    timeSpan: number,
    chatSpan: number,
    nip: string,
    jip: string,

    minversion_an: string,
    minversion_ios: string,
    minversion_jan: string,
    minversion_jios: string,
    /**使用downloadservice 强迫下载的最低版本 */
    minForcedversion_an: string,
    newVersion_ios: string,
    apkUrl: string,//todo:注意，七牛云的地址后面不能有apk后缀，否则不能下载。安卓代码里会在下载后在文件名后加上后缀
    upgradeInfo_ios: string,
    upgradeInfo_an: string
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

