import { UserAccount } from "../userAccount/userAccount";
import { UserState } from "../userAccount/userState";

interface serverParam {
    /**服务器时间和手机时间差，精确到分钟即可 */
    serverTimeDiff : number,
    timeSpan : number,
    chatSpan : number,
    nip : string,
    jip : string
}

export interface globalFields {
    networkConnected : boolean,
    timeSpan : number,
    chatSpan : number,
    ip : string,
    user : UserAccount,
    serverParam : serverParam,
    hasInitAppUserState : boolean,
    hasInitOnlineState : boolean,
    userState : UserState,
    hasInitLocalSearchParksKey : boolean,
    hasInitLocalThankParksKey : boolean,
    
}

