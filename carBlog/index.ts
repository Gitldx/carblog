/**
 * @format
 */

import { AppRegistry } from 'react-native';
// import App from './App';

import App from './src/app.component'
import { name as appName } from './app.json';
import { getOnlineOffline, networkListener } from './src/core/uitls/netStatus'
import { globalFields } from './src/core/model/global';
import { showMessage, hideMessage } from "react-native-flash-message";
import { readParameter } from './src/core/uitls/readParameter';
import EventRegister, { initAppOnlineCompleteEvent, initAppUserStateCompleteEvent } from './src/core/uitls/eventRegister'
import { launchMessageLooper, readBulletin } from './src/core/uitls/messageLooper'
import co from 'co'
import { initUserState, afterLocalLaunch, hasInitOnlineAppState } from './src/core/userAccount/functions'
import { UserState } from './src/core/userAccount/userState';


declare var global: globalFields

AppRegistry.registerComponent(appName, () => App);



function* initAppState() {
    yield initUserState();
    yield UserState.instance.launch();
    global.hasInitAppUserState = true
    EventRegister.emitEvent(initAppUserStateCompleteEvent)
    yield readParameter()

    // yield afterLocalLaunch()

    launchMessageLooper()
    // readBulletin()
    global.hasInitOnlineState = true
    EventRegister.emitEvent(initAppOnlineCompleteEvent)
    RegNetworkConnChangedListener();

}


function RegNetworkConnChangedListener() {
    networkListener(() => {
        getOnlineOffline((isConnected) => {

            global.networkConnected = isConnected;

            if (!isConnected) {
                showMessage({
                    message: "网络异常",
                    description: "网络无法访问,请检查网络你的网络设置",
                    duration: 10000,
                    type: "warning",
                    icon: "warning",
                    position: 'top',
                });
            }
            else {
                //如果当前状态为empty，再次尝试用户登陆

                co(reInitOnlineAppState)
            }
        })
    })
}





setTimeout(() => {
    getOnlineOffline((isConnected) => {

        if (!global.networkConnected) {
            global.networkConnected = isConnected;
        }

        if (!isConnected) {
            showMessage({
                message: "网络异常",
                description: "网络无法访问,请检查网络你的网络设置",
                duration: 10000,
                type: "warning",
                icon: "warning",
                position: 'top'
            });

            co(localInitAppUserState)
        }
        else {
            co(initAppState)
        }
    })
}, 1000)



networkListener(() => {
    getOnlineOffline((isConnected) => {

        global.networkConnected = isConnected;

        if (!isConnected) {
            showMessage({
                message: "网络异常",
                description: "网络无法访问,请检查网络你的网络设置",
                duration: 10000,
                type: "warning",
                icon: "warning",
                position: 'top'
            });
        }
    })
})






function* localInitAppUserState() {
    yield initUserState();
    // yield UserState.instance.launch();
  
    global.hasInitAppUserState = true
    EventRegister.emitEvent(initAppUserStateCompleteEvent)
    RegNetworkConnChangedListener();
  
  }




function* reInitOnlineAppState() {
    if (hasInitOnlineAppState()) { return }

    yield readParameter()
    yield afterLocalLaunch()

    global.hasInitOnlineState = true
    EventRegister.emitEvent(initAppOnlineCompleteEvent)


    // launchMessageLooper()
    // readBulletin()
    global.hasInitOnlineState = true;
}