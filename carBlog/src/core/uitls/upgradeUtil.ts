import { Platform } from "react-native"
import codePush, { DownloadProgress, UpdateDialog } from "react-native-code-push";
import EventRegister, { upgradeEvent } from "./eventRegister";
import { NavigationScreenProp, NavigationParams } from "react-navigation";
import { NavigationRoute } from "react-navigation";
import { globalFields } from "../model";
import { APPVERSION_ANDROID, APPVERSION_IOS, JSAPIVERSION_IOS, JSAPIVERSION_ANDROID } from "./constants";


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
    const productionkey = Platform.select({
      ios: "NUXmaeb45usx8amOwqmKx8WcIjgCF37oDUkIdX",
      android: "U_6W3QJwM96H053p1Y_Gx4IoZf-paedRjKIjHg"
    })
    const deploymentKey = debugkey
    // console.warn("codepush")
    codePush.checkForUpdate(deploymentKey).then((update) => {
      console.warn(`codepush:${JSON.stringify(update)}`)
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

export function currentAppversion(){
  return Platform.select({
    ios : APPVERSION_IOS,
    android : APPVERSION_ANDROID 
  })
}


export function currentJSversion(){
  return Platform.select({
    ios : JSAPIVERSION_IOS,
    android : JSAPIVERSION_ANDROID
  })
}

function versionInt(versionname:string){
  const vArr = versionname.split(".")
  const vInt = Number(vArr[0]) * 10000 + Number(vArr[1]) * 100 + Number(vArr[2])
  return vInt
}

export function checkAppUnavailable() {
  const minVersion = Platform.select({
    ios : global.serverParam.minversion_i,
    android : global.serverParam.minversion_a
  }) 

  if(minVersion == "0.0.0"){
    return false
  }

  const vInt = versionInt(minVersion)
  
  const vCurrent= Platform.select({
    ios : APPVERSION_IOS,
    android : APPVERSION_ANDROID
  }) 
  const vIntCurrent = versionInt(vCurrent) 
  
  return vIntCurrent <= vInt;
}



export function checkAppUnavailable_js() {
  const minVersion = Platform.select({
    ios : global.serverParam.minversion_ji,
    android : global.serverParam.minversion_ja
  }) 

  if(minVersion == "0.0.0"){
    return false
  }

  const vInt = versionInt(minVersion)
  const vCurrent = Platform.select({
    ios : JSAPIVERSION_IOS,
    android : JSAPIVERSION_ANDROID
  }) 
  const vIntCurrent = versionInt(vCurrent)

  
  return vIntCurrent <= vInt;
}


/**
 * 更新策略
 * 频繁的更新通过codepush 更新js代码。当js更新累计到一定步骤，仍未更新，就通过checkAppUnavailable_js退出app，强制用户手动到应用市场下载
 * 涉及到原生代码的更新，安卓方面先实验性的使用bugly。如果安卓累计到一定步骤仍未更新，就先触发checkAppUnavailable_Forcedversion，
 * 再尝试一次强迫用户下载，如果再不行，就触发checkAppUnavailable，退出app，强制用户手动到应用市场下载
 */
export function checkAppUnavailable_Forcedversion(){ //todo:安卓downloadservice
  const minVersion = global.serverParam.minForcedversion_a

  if(minVersion == "0.0.0"){
    return false
  }

  const vInt = versionInt(minVersion)
  const vCurrent = APPVERSION_ANDROID
  const vIntCurrent = versionInt(vCurrent)

  return vIntCurrent <= vInt;
}