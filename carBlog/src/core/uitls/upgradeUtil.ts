import { Platform, NativeModules, Alert } from "react-native"
import codePush, { DownloadProgress, UpdateDialog } from "react-native-code-push";
import EventRegister, { upgradeEvent } from "./eventRegister";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import { NavigationRoute } from "react-navigation";
import { globalFields } from "../model";
import { APPVERSION_ANDROID, APPVERSION_IOS, JSAPIVERSION_IOS, JSAPIVERSION_ANDROID, IOSAPPID } from "./constants";
import { getConnectionType } from "./netStatus";
import { simpleAlert, towActionAlert } from "./alertActions";
import { toDate, timeDiffInSeconds, isEmpty } from "./common";
import { Upgradehistory, getUpgradeHistory, saveUpgradeHistory } from "./storage/localConfig";


declare var global: globalFields


export class Upgrade {
  constructor(nav: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>) {
    this.navigation = nav
  }


  private navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>


  private updateDialogOption: UpdateDialog = {
    optionalIgnoreButtonLabel: '稍后',
    optionalInstallButtonLabel: '立即更新',
    optionalUpdateMessage: '有新版本了，是否更新？',
    title: '更新提示',
    mandatoryContinueButtonLabel: '继续',
    mandatoryUpdateMessage: '版本更新'
  }

  private codePushIsMandatory: boolean = false
  private codePushIsSilent: boolean = false
  private syncStatusChangedCallback = (status) => {
    switch (status) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        if (this.codePushIsMandatory == false && this.codePushIsSilent == true) {
          //静默，非强制更新不用跳转到更新界面
        }
        else {
          this.navigation.navigate("UpgradeModel", { isMandatory: this.codePushIsMandatory, isSilent: this.codePushIsSilent })
        }
        // console.warn("DOWNLOADING_PACKAGE");

        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:

        EventRegister.emitEvent(upgradeEvent, { eventType: 1 })
        break;
    }
  }

  private downloadProgressCallback = (progress: DownloadProgress) => {
    EventRegister.emitEvent(upgradeEvent, { eventType: 0, totalBytes: progress.totalBytes, receivedBytes: progress.receivedBytes, })
  }


  public codePush() {
    const debugkey = Platform.select({
      ios: "jgNxPKr9RBwC5Tt4iFKQPsnVef3tVJV4lBVUg",
      android: "n6lr6Cqg19Mmwm7i-GbEvm7yqUifjeHel_f0Z"
    })
    const productionkey = Platform.select({//todo:上线前更换成这个
      ios: "NUXmaeb45usx8amOwqmKx8WcIjgCF37oDUkIdX",
      android: "U_6W3QJwM96H053p1Y_Gx4IoZf-paedRjKIjHg"
    })
    const deploymentKey = debugkey
    // console.warn("codepush")
    codePush.checkForUpdate(deploymentKey).then((update) => {
      // console.warn(`codepush:${JSON.stringify(update)}`)
      if (!update) {
        codePush.notifyAppReady() //已是最新版本
      } else {
        const description: { version: string, desc: string, silent: boolean } = JSON.parse(update.description)
        this.codePushIsSilent = description.silent
        this.codePushIsMandatory = update.isMandatory

        // if (description.version == JSAPIVERSION) {
        //   return;
        // }

        if (description.silent == true) {
          codePush.sync({
            deploymentKey: deploymentKey,
            installMode: codePush.InstallMode.ON_NEXT_RESTART,
            mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
          },
            this.syncStatusChangedCallback,
            this.downloadProgressCallback
          )
        }
        else {
          codePush.sync({
            deploymentKey: deploymentKey,
            updateDialog: this.updateDialogOption,
            installMode: codePush.InstallMode.ON_NEXT_RESTART,
            mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
          },
            // (status) => {
            //   switch (status) {
            //     case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            //       this.props.navigation.navigate("UpgradeModel", { isMandatory: update.isMandatory })
            //       // console.warn("DOWNLOADING_PACKAGE");

            //       break;
            //     case codePush.SyncStatus.UPDATE_INSTALLED:

            //       EventRegister.emitEvent(upgradeEvent, { eventType: 1 })
            //       break;
            //   }
            // },
            // (progress) => {
            //   EventRegister.emitEvent(upgradeEvent, { eventType: 0, totalBytes: progress.totalBytes, receivedBytes: progress.receivedBytes, })
            // }
            this.syncStatusChangedCallback,
            this.downloadProgressCallback
          );
        }


      }
    })
    //   codePush.sync({
    //     // updateDialog: true, // 是否打开更新提示弹窗
    //     installMode: codePush.InstallMode.IMMEDIATE,
    //     mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
    //     deploymentKey: 'NUXmaeb45usx8amOwqmKx8WcIjgCF37oDUkIdX',
    //     //对话框
    //     updateDialog : {
    //       //是否显示更新描述
    //       appendReleaseDescription : true ,
    //       //更新描述的前缀。 默认为"Description"
    //       descriptionPrefix : "更新内容：" ,
    //       //强制更新按钮文字，默认为continue
    //       mandatoryContinueButtonLabel : "立即更新" ,
    //       //强制更新时的信息. 默认为"An update is available that must be installed."
    //       mandatoryUpdateMessage : "必须更新后才能使用" ,
    //       //非强制更新时，按钮文字,默认为"ignore"
    //       optionalIgnoreButtonLabel : '稍后' ,
    //       //非强制更新时，确认按钮文字. 默认为"Install"
    //       optionalInstallButtonLabel : '后台更新' ,
    //       //非强制更新时，检查到更新的消息文本
    //       optionalUpdateMessage : '有新版本了，是否更新？' ,
    //       //Alert窗口的标题
    //       title : '更新提示'
    //     },
    //  });
  }
}

export function currentAppversion() {
  return Platform.select({
    ios: APPVERSION_IOS,
    android: APPVERSION_ANDROID
  })
}


function currentJSversion() {
  return Platform.select({
    ios: JSAPIVERSION_IOS,
    android: JSAPIVERSION_ANDROID
  })
}

function versionInt(versionname: string) {
  const vArr = versionname.split(".")
  const vInt = Number(vArr[0]) * 10000 + Number(vArr[1]) * 100 + Number(vArr[2])
  return vInt
}

/**
 * 小于支持版本就强制退出app
 */
export function checkAppUnavailable() {
  const minVersion = Platform.select({
    ios: global.serverParam.minversion_ios,
    android: global.serverParam.minversion_an
  })

  if (minVersion == "0.0.0") {
    return false
  }

  const vInt = versionInt(minVersion)

  const vCurrent = currentAppversion()
  const vIntCurrent = versionInt(vCurrent)

  return vIntCurrent <= vInt;
}



export function checkAppUnavailable_js() {
  const minVersion = Platform.select({
    ios: global.serverParam.minversion_jios,
    android: global.serverParam.minversion_jan
  })

  if (minVersion == "0.0.0") {
    return false
  }

  const vInt = versionInt(minVersion)
  const vCurrent = currentJSversion()
  const vIntCurrent = versionInt(vCurrent)


  return vIntCurrent <= vInt;
}




async function getAppleStoreVersion() {
  const url = `https://itunes.apple.com/cn/lookup?id=${IOSAPPID}`
  const res = await fetch(url).then((response) => response.json())
  return res.results[0].version
}


// export async function checkAppUnavailable_Forcedversion() {


//   const minVersion = global.serverParam.minForcedversion_an

//   if (minVersion == "0.0.0") {
//     return false
//   }

//   const vInt = versionInt(minVersion)
//   const vCurrent = APPVERSION_ANDROID
//   const vIntCurrent = versionInt(vCurrent)

//   if (vIntCurrent <= vInt) {
//     const type = await getConnectionType()

//     if (type != 'wifi') {
//       return;
//     }

//     simpleAlert(null, "app稍后将重装升级", "知道了", () => {
//       nativeUpdateApp()
//     })
//     upgradeStrategy()

//   }
// }


/**
 * 自己写的下载更新逻辑
 */
export function nativeUpdateApp() {

  if (Platform.OS === 'ios') {
    // NativeModules.upgrade.getAppVersion((error, Version) => {
    //   if(error){
    //     console.log(error)
    //   }else{
    //     console.warn(Version)
    //   }
    // })
    NativeModules.upgrade.openAPPStore(IOSAPPID)
  } else {
    const AndroidAutoUpdate = NativeModules.AndroidAutoUpdate

    // RNAndroidAutoUpdate.getVersionName((versionCode) => {
    //   androidCurrentVersion = versionCode;
    // });
    AndroidAutoUpdate.goToDownloadApk(global.serverParam.apkUrl);
  }

  // this.GetAPPOnlineVersion(showTip);
}


function popupMessage(hint) {
  if (Platform.OS == "android") {
    simpleAlert(null, hint, "知道了", () => {
      nativeUpdateApp()
    })
  }
  else {
    towActionAlert(null, hint, "稍后", null, "更新", () => { nativeUpdateApp() })
  }
}


/**
 * 更新策略
 * 频繁的更新通过codepush 更新js代码。当js更新累计到一定步骤，仍未更新，就通过checkAppUnavailable_js退出app，强制用户手动到应用市场下载
 * 涉及到原生代码的更新，安卓方面先实验性的使用bugly。如果安卓累计到一定步骤仍未更新，就先触发upgradeStrategy，
 * 再尝试一次强迫用户下载，如果再不行，就触发checkAppUnavailable，退出app，强制用户手动到应用市场下载
 */
export async function upgradeStrategy() {//todo:上线前测一下

  const version = Platform.select({
    ios: global.serverParam.newVersion_ios,
    android: global.serverParam.minForcedversion_an
  })
  if (version == "0.0.0") {
    return;
  }
  const currentV = currentAppversion()
  if (versionInt(currentV) >= versionInt(version)) {
    return
  }
  const type = await getConnectionType()

  if (type != 'wifi') {
    return;
  }

  if (Platform.OS == "ios") {
    const appstoreversion = await getAppleStoreVersion()
    if (versionInt(appstoreversion) <= versionInt(version)) {
      return;
    }
  }


  let history: Upgradehistory = await getUpgradeHistory()

  const d1 = new Date()
  const d1str = toDate(d1, "yyyy/MM/dd hh:mm:ss")
  const upgradeInfo = Platform.select({
    ios: global.serverParam.upgradeInfo_ios,
    android: global.serverParam.upgradeInfo_an
  })
  const hint = isEmpty(upgradeInfo) ? "有新版本可以更新了" : upgradeInfo
  if (history == null) {//第一次

    history = { version: version, times: d1str }
    saveUpgradeHistory(history)
    popupMessage(hint)
  }
  else {
    
    if (history.version != version) {//新版本，提醒
      history.version = version
      history.times = d1str
      // towActionAlert(null, hint, "稍后", null, "更新", () => { nativeUpdateApp() })
      saveUpgradeHistory(history)
      popupMessage(hint)
    }
    else {//在相同版本的情况下，最多3次提醒用户
      const timesArr = history.times.split("||")
      if (timesArr.length >= 3) {//已经达到3次

      }
      else {
        const last = timesArr[timesArr.length - 1]
        const lastTime = new Date(last)
        const dayDiff = timeDiffInSeconds(d1, lastTime) / (60 * 60 * 24)
        if (dayDiff >= 3) {//隔3天提醒一次
          // towActionAlert(null, hint, "稍后", null, "更新", () => { nativeUpdateApp() })
          timesArr.push(d1str)
          history.times = timesArr.join("||")
          saveUpgradeHistory(history)
          popupMessage(hint)
        }

      }
    }
  }


  /*  const d2 = new Date()
   d2.setTime(d2.getTime() + 24 * 60 * 60 * 1000)
   const str = toDate(d1,"yyyy/MM/dd hh:mm:ss") + "||"  + toDate(d2,"yyyy/MM/dd hh:mm:ss")
 
   console.warn(str)
 
   const arr = str.split("||")
   console.warn(new Date(arr[1]))
   const d3 = new Date(d2.getTime() +  + 24 * 60 * 60 * 1000)
   arr.push(toDate(d3,"yyyy/MM/dd hh:mm:ss"))
   const diff = timeDiffInSeconds(new Date(arr[0]),new Date(arr[2]))/(24*60*60)
   console.warn(diff) */
}