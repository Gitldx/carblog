import * as constants from './constants'
import EventRegister, { loginEvent } from '../uitls/eventRegister';
import { globalFields } from '../model/global';
import { UserAccount } from './userAccount';
import { isEmpty } from '../uitls/common';
import { LoginEventData } from './type';

declare var global : globalFields

export interface State{
    stateStr : string,
    transferOut():void,
    transferIn():void,
    launch():void,
}

export class UserState {

    public _currentState : State;


    constructor(initState) {

        this._currentState = initState
        
    }


    static get instance() {
        // if(!global.userState){
        //     UserState.instance = new UserState()
        // }
        return global.userState;
    }



    /*    static async initInstance() {
           const localUa = await UserAccount.getLocalAccount()
           
           const localKdNum = await KdNum.getLocalKdNum()
           const stateStr = UserState.getInitStateStr(localUa, localKdNum)
   
         
   
           // console.warn(`statestr:${stateStr}
           // localUa:${JSON.stringify(localUa)}
           // localKdnum:${JSON.stringify(localKdNum)}
           // `)
   
           var initState = null
           var ua = null
           var kd = null
           switch (stateStr) {
               case constants.EMPTY:
                   initState = new EmptyState()
                   break;
               case constants.ACCOUNT:
                   ua = new UserAccount(localUa.id, localUa.deviceId, localUa.accountName, localUa.password, localUa.accountHasLogined)
                   initState = new AccountState(ua)
                   break;
               case constants.KDNUM:
             
                   kd = new KdNum(localKdNum.id, localKdNum.uid, localKdNum.code)
                   
                   initState = new KdNumState(kd)
                   break;
               case constants.H_ACCOUNT:
                   ua = new UserAccount(localUa.id, localUa.deviceId, localUa.accountName, localUa.password, localUa.accountHasLogined)
                   initState = new Hybrid_AccountState(ua)
                   break;
               case constants.H_KDNUM:
              
                   kd = new KdNum(localKdNum.id, localKdNum.uid, localKdNum.code)
                  
                   initState = new Hybrid_KdNumState(kd)
                   
                   break;
           }
   
           global.userState = new UserState(initState)
           
       }
    */


    static getInitStateStr(localUa : UserAccount) : string {
        if(isEmpty(localUa)){
            return constants.EMPTY
        }

        if(localUa.accountHasLogined == false){
            return constants.EMPTY
        }

        switch(localUa.role){
            case 0:
                return constants.EMPTY;
            case 1:
                return constants.DRIVER;
            case 2:
                return constants.PEDESTRIAN
        }
    }


    transfer(newState:State) {
        this._currentState.transferOut();
        newState.transferIn()
        this._currentState = newState

        let accountHasLogined = false
        const stateStr = newState.stateStr;
        if(stateStr == constants.PEDESTRIAN || stateStr == constants.DRIVER){
            accountHasLogined = true;
        }
        console.warn(`userstate.transfer:${JSON.stringify({ accountHasLogined,stateStr })}`)
        const data : LoginEventData = { accountHasLogined,stateStr }
        EventRegister.emitEvent(loginEvent, data)
    }


    currentState() : State {
        return global.userState._currentState;
    }


    async launch() {

        await this.currentState().launch()
    }




    static accountStatus() {
        if (!UserState.instance) {
            return -1;
        }

        switch (UserState.instance.currentState().stateStr) {
            case constants.DRIVER:
                return 1;
            case constants.PEDESTRIAN:
                return 2;
            case constants.EMPTY:
                return 0;
            
        }
    }

}