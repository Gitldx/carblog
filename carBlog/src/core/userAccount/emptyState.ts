
import {AbstractState} from './abstractState'
import * as constants from './constants'
import { State } from './userState';

export class EmptyState extends AbstractState implements State {

    public stateStr = constants.EMPTY

    constructor() {
        super()
    }

    public launch() {

    }


    public transferOut() {
        
    }

    public transferIn() {
        const state = this.currentState().stateStr ;
        if (state == constants.DRIVER || state == constants.PEDESTRIAN) {
            //EventRegister.emit(loginEvent, { accountHasLogined: false })
        }
    }

}
