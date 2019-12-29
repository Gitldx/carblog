import {AbstractState} from './abstractState'
import * as constants from './constants'
// import {KdNum} from './KdNum'
import {UserAccount} from './userAccount'
import { saveAsyncStorage,getStorageAsync, getAsyncStorage, isEmpty, removeAsyncStorage } from '../uitls/common'
import {updateGlobalUserAccount} from './functions'
import { State } from './userState';
// import { getDeviceId } from '../../common/deviceId'

export class DriverState extends AbstractState implements State {
    
    _userAccount : UserAccount
    public stateStr = constants.DRIVER

    constructor(userAccount : UserAccount) {
        super()
        this._userAccount = userAccount
    }


    async launch() {
        const d = this._userAccount
        
        updateGlobalUserAccount(d,true,true)
        await this._logUALocally()

        // UserAccount.serverLogin((result) => {

        //     if (result.ok) {
        //         ua.accountHasLogined = true
        //         ua.id = d.id
        //         this._logUALocally()
        //     }

        // })


    }


    transferOut() {
        const ua = UserAccount.instance
        ua.accountHasLogined = false


        this._logUALocally()

        // EventRegister.emit(loginEvent, { accountHasLogined: false })
    }

    transferIn() {
        
        if (this.currentState().stateStr == constants.EMPTY) {
            this._dojob()
        }
        else if (this.currentState().stateStr == constants.DRIVER) {
            this._dojob()
        }
        else if (this.currentState().stateStr == constants.PEDESTRIAN) {
            this._dojob()
        }

    }


    _dojob() {
        const d = this._userAccount
        updateGlobalUserAccount(d,true)

        this._logUALocally()
    }


   async  _logUALocally() {
        const d = UserAccount.instance
        // const temp = JSON.stringify({
        //     id: d.id, accountName: d.accountName, password: d.password, accountHasLogined: d.accountHasLogined,role : d.role,
        //     deviceId: getDeviceId(), time: new Date()
        // })
        const temp = JSON.stringify({
            ...d, time: new Date()
        })
        await saveAsyncStorage(UserAccount.storageKey, temp, () => { }, () => { })
    }

}
