
import {
    AsyncStorage
} from 'react-native';


import { showMessage } from 'react-native-flash-message'
// export { toDate } from './prototype'



import { NativeModules } from 'react-native'
import { simpleAlert } from './alertActions';
import {wgs84togcj02,gcj02towgs84} from 'coordtransform'



(<any>Date.prototype).format = function (format : string) :string {
    let date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

//转换成日期
export function toDate(timestamp : any, format1 : string = 'yyyy-MM-dd hh:mm:ss') {
    
    try {
        if (timestamp > 10000) {
            let date = new Date();
            date.setTime(timestamp);
            
            return (<any>date).format(format1);//2014-07-10 10:21:12
        } else {
            return '';
        }
    } catch (erro) {
        return '';
    }
}

export function getTimeDiff(timeStamp : Date){
    const d = new Date();
    return Math.abs((d.getTime() - timeStamp.getTime()))/(60*1000);
}



// const NativeAPI = NativeModules.NativeAPI

export function getDeviceId(): string {
    return "deviceId"//NativeAPI.deviceId
}


/**
 * 判断对象，数组，字符串是否为空
 * @param obj  (null|undefined|''|'   '|[]|{}) 均判断为空，返回true
 * @returns {boolean}
 */
export function isEmpty(obj: string | {} | Array<any>): boolean {
    if (!obj) {
        return true;
    } else if (typeof obj === 'object'/*  && str instanceof Array */) {
        if (Object.keys(obj).length === 0) {
            return true;
        }
        else {
            return false;
        }
    } else if ((<string>obj).replace(/(^\s*)|(\s*$)/g, "").length === 0) {
        return true;
    }
    return false;
}



export function showNoNetworkAlert() {
    showMessage({
        message: "网络未连接，请打开网络",
        position: "center",
        duration: 1000,
        type: 'warning'
    })
}


export function showNoAccountOnAlert(){
    showMessage({
        message:"提示",
        description : "请先注册或者登录账号",
        type : "warning",
        icon : "warning",
        position : 'center'
      })
}


export function showOngoingAlert(msg?:string){
    showMessage({
        message : "提示",
        description : msg ? msg : "提交中...",
        type :"info",
        icon : "info",
        position : 'center',
        duration : 3000
    })
}



export async function getStorageAsync(key: string) {
    try {
        const tepm = await AsyncStorage.getItem(key)
        return { isOk: true, data: tepm ? JSON.parse(tepm) : {} }
    }
    catch (error) {
        return { isOk: false }
    }

}


/**
 * 取值
 * @param key
 * @param successCallback
 * @param errorCallback
 */
export function getAsyncStorage(key, successCallback, errorCallback) {
    AsyncStorage.getItem(key, (error, result) => {
        if (error) {
            errorCallback(error);
        }
        else {
            successCallback(result);
        }
    })
}


/**
 * 删除对应key的
 * @param key
 * @param successCallback
 * @param errorCallback
 */
export function removeAsyncStorage(key, successCallback, errorCallback) {
    AsyncStorage.removeItem(key, error => {
        if (error) {
            errorCallback(error);
        }
        else {
            successCallback();
        }
    })
}



/**
 * 存储
 * @param key
 * @param value
 * @param successCallback
 * @param errorCallback
 */
export function saveAsyncStorage(key, value, successCallback = () => { },
    errorCallback = (any) => { console.warn(JSON.stringify(any)); simpleAlert("系统错误", "读取本地数据时发生了一点错误，请重新尝试") }) {


    AsyncStorage.setItem(key, value, error => {
        if (error) {
            errorCallback(error);
        }
        else {
            successCallback();
        }
    })
}


/**
 * yyyyMMddhhmmssms
 */
export function getTimestampStr(){
    const d = new Date()
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const dd = d.getDate()
    const h = d.getHours()
    const mm = d.getMinutes()
    const s = d.getSeconds()
    const ms = d.getMilliseconds()
    
    return (y.toString() + 
       ( m<10?'0'+m.toString():m.toString() )+
       ( dd<10?'0'+dd.toString():dd.toString() ) + 
       ( h<10?'0'+h.toString():h.toString() )+
       ( mm<10?'0'+mm.toString():mm.toString() )+
       ( s<10?'0'+s.toString():s.toString()  )+
       ( ms<10?'00'+ms.toString():(ms<100?"0"+ms.toString():ms.toString()) )
        )

}


export function formatTimeStampStr(timeStamp,displayYear = false,displaySeconds = false){

    let result = timeStamp.substr(4,2)+ "/" + timeStamp.substr(6,2) + " " + timeStamp.substr(8,2) + ":" + timeStamp.substr(10,2)


    if(displayYear){
        result = timeStamp.substr(0,4) + "/" + result 
    }

    if(displaySeconds){
        result = result + ":" + timeStamp.substr(12,2)
    }
    


    return result
    
}


export function timeDiffInSeconds(time1:Date,time2:Date){
    const diff = Math.abs(time1.getTime()-time2.getTime())
    // console.warn(`diff:${diff/1000}`)
    return diff/1000
}


export function displayIssueTime(time:Date) {

    const minutes = getTimeDiff(time).toFixed(0)

    if (Number(minutes) < 60) {
        return minutes + "分钟前"
    }
    const hours = (Number(minutes) / 60).toFixed(0)
    if (Number(hours) < 24) {
        return hours + '小时前'
    }
    const day = (Number(hours) / 24).toFixed(0)
    if (Number(day) < 30) {
        return day + "天前"
    }
    else {
        // const m = (Number(day) / 30).toFixed(0)
        return (Number(day) / 30).toFixed(0) + "月前"
    }
}


export function gcj2wgs(lng,lat){
    const d = gcj02towgs84(lng,lat)
    return {lng:d[0],lat:d[1]}
}