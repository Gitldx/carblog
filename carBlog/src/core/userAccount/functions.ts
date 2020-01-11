import { UserAccount } from "./userAccount";
import EventRegister, { loginEvent } from "../uitls/eventRegister";
import { saveAsyncStorage, isEmpty, removeAsyncStorage } from "../uitls/common";
import { globalFields } from "../model/global";
import { UserState, State } from "./userState";
import *  as constants from './constants'
import { EmptyState } from "./emptyState";
import { PedestrianState } from "./pedestrianState";
import { DriverState } from "./driverState";
import { LoginEventData } from "./type";

declare var global: globalFields


/**
 * 1:车主,2:路人,0:无号，-1:异常
 */
export function onlineAccountState(){
    const state = UserState.accountStatus()
    return state
    // if (state == 1 || state == 2) {
    //     return 1;
    // }
    // else{
    //     return 0;
    // }
}

export function hasInitAppUserState(){
    const b = global.hasInitAppUserState
    return b ? true : false
}


export async function initUserState() {
    // await removeAsyncStorage(UserAccount.storageKey,()=>{},()=>{})
    const localUa = await UserAccount.getLocalAccount()

    const stateStr = UserState.getInitStateStr(localUa)

   
    let initState : State = null
    var ua : UserAccount = null
    switch (stateStr) {
        case constants.EMPTY:
            initState = new EmptyState()
            break;
        case constants.PEDESTRIAN:
            ua = new UserAccount(localUa.id, localUa.deviceId, localUa.accountName, localUa.password, localUa.accountHasLogined, localUa.role)
            ua.initInfo({nickname : localUa.nickname,phone:localUa.phone,carNumber : localUa.carNumber,image : localUa.image})
            initState = new PedestrianState(ua)
            break;
        case constants.DRIVER:
            ua = new UserAccount(localUa.id, localUa.deviceId, localUa.accountName, localUa.password, localUa.accountHasLogined, localUa.role)
            ua.initInfo({nickname : localUa.nickname,phone:localUa.phone,carNumber : localUa.carNumber,image:localUa.image})
           
            initState = new DriverState(ua)
            break;

    }

    // console.warn(`initUserState:${JSON.stringify(localUa)}`)

    global.userState = new UserState(initState)

    // if(isEmpty(localUa)){
    //     return;
    // }
    // updateGlobalUserAccount(localUa, true, true)

    // await saveUserAccountLocally(localUa)
}


export async function saveUserAccountLocally(localUa: UserAccount) {
    // const temp = JSON.stringify({
    //     id: localUa.id, accountName: localUa.accountName, password: localUa.password, accountHasLogined: localUa.accountHasLogined,
    //     deviceId: getDeviceId(), time: new Date()
    // })
    const temp = JSON.stringify({
         ...localUa,time: new Date()
    })
   
    await saveAsyncStorage(UserAccount.storageKey, temp)
}



export function updateGlobalUserAccount(d: UserAccount, accountHasLogined: boolean, onLaunch = false) {
    
    const ua = UserAccount.instance
    Object.assign(ua,d)
  
    // ua.accountHasLogined = accountHasLogined
    // ua.id = d.id
    // ua.accountName = d.accountName
    // ua.password = d.password
    // ua.role = d.role
    // ua.nickname = d.nickname
    // ua.phone = d.phone
    // ua.carNumber = d.carNumber


    if (onLaunch) {//非启动时登录已经在 userstate 里emit登录事件了
        const data : LoginEventData =  { accountHasLogined: accountHasLogined, onLaunch }
        EventRegister.emitEvent(loginEvent,data)
    }
}



export async function afterLocalLaunch() {

    const bool_flag = await UserAccount.serverLogin()//A-2


    if (!bool_flag) {

    }
}


export function hasInitOnlineAppState() {
    const b = global.hasInitOnlineState
    return b ? true : false
}