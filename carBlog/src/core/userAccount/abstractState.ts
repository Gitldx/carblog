import { globalFields } from "../model/global";
import { State } from "./userState";

declare var global : globalFields

export class AbstractState{

    constructor() {
    }


    public currentState() : State {
        return global.userState._currentState;
    }

}