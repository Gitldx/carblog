
import {AbstractState} from './abstractState'
import * as constants from './constants'
import { State } from './userState';
import { UserAccount } from './userAccount';
import { updateGlobalUserAccount } from './functions';

export class EmptyState extends AbstractState implements State {

    _userAccount : UserAccount
    public stateStr = constants.EMPTY

    constructor(userAccount? : UserAccount) {
        super()
        this._userAccount = userAccount
    }

    public launch() {

    }


    public transferOut() {
        
    }

    public transferIn() {
        const d = this._userAccount
        updateGlobalUserAccount(d,false)
        const state = this.currentState().stateStr ;
        if (state == constants.DRIVER || state == constants.PEDESTRIAN) {
            //EventRegister.emit(loginEvent, { accountHasLogined: false })
        }
    }

}
