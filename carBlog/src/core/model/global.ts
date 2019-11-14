import { UserAccount } from "../userAccount/userAccount";
import { UserState } from "../userAccount/userState";

interface serverParam {
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

}

