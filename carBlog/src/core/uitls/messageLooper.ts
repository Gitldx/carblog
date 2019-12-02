import EventRegister, { messageEvent, newFriendEvent } from './eventRegister'
import { RestfulJson, getNodeService, loopService } from './httpService'
// import { allComponentsHasMounted } from './componentMountEvent'

import { UserAccount } from '../userAccount/userAccount'
import debounce from './debounce';
import { getlastBulletinTime, saveLastBulletinTime } from './storage/localConfig';

import { getNIP, getLoopTimeSpan, getLoopChatSpan } from './readParameter';
import { networkConnected } from './netStatus';

import { globalFields } from '../model'
import { simpleAlert } from './alertActions';
import { MESSAGETYPE } from '../model';
import { HomeMessage } from '../model';

import { isEmpty } from './common';
import { WebMessage } from '../model/message.model';

declare var global: globalFields

// function getPhoneState() {

//     if (!global.phoneState) {
//         gl0obal.phoneState = 'disconnected'
//     }
//     return global.phoneState
// }



// export const MESSAGETYPE = {
//     sys: {
//         bulletin: 1,

//     },
//     user: {
//         chat: 10,
//         sysEmail: 14,
//     }
// }




export class MessageLooper {



    constructor() { }


    get server() {
        return "http://" + getNIP() + "/msgs" //'http://129.28.152.138:3000/msgs'  
    }


    looper = null;

    lastMessageTime : Date


    static get timeSpan() {
        if (!global.timeSpan) {

            global.timeSpan = getLoopTimeSpan() //10 * 60 * 1000; 
            return global.timeSpan;
        }
        else {
            return global.timeSpan;
        }
    }


    static get chatSpan() {
        if (!global.chatSpan) {

            global.chatSpan = getLoopChatSpan() //10 * 60 * 1000; 
            return global.chatSpan;
        }
        else {
            return global.chatSpan;
        }
    }


    static _instance = new MessageLooper()
    flag = "";
    checkIfSingleInstance() {
        if (this.flag != "global") {
            simpleAlert(null, "warning!the static instance might be different!!!!")
        }
    }

    static get instance() {
        return MessageLooper._instance;
    }

    getMsgIdentifier(): string {
        // const state = UserState.accountStatus()


        // if (state == 1 || state == 2) {
        //     return UserAccount.instance.id;
        // }
        // else if (state == 3 || state == 4) {
        //     return KdNum.instance.uid
        // }

        // return null;

        // return currentUid()
        return UserAccount.getUid()
    }

    startListen() {

        clearInterval(this.looper)

        this.readLoopJob()

        // this.looper = setInterval(() => {
        //     this.readLoopJob()
        // }, MessageLooper.timeSpan)
    }

    startChat() {
        this.stopListen()
        this.readLoopJob()

        this.looper = setInterval(() => {
            this.readLoopJob()
        }, MessageLooper.chatSpan)
    }


    exitChat() {
        this.stopListen();
        this.looper = setInterval(() => {
            this.readLoopJob()
        }, MessageLooper.timeSpan)
    }


    stopListen() {
        clearInterval(this.looper)
    }

    debounce = debounce(() => {
        this.stopListen()
        this.startListen()
    }, 1000)

    manualReadMessage() {
        this.debounce()
    }

    static _unReadMsgs: HomeMessage[];
    static get unReadMessage(): HomeMessage[] {
        if (isEmpty(MessageLooper._unReadMsgs)) {
            MessageLooper.unReadMessage = []//conversations
        }
        return MessageLooper._unReadMsgs;
    }

    static set unReadMessage(msges: HomeMessage[]) {
        MessageLooper._unReadMsgs = msges
    }



    static _readMsgs: HomeMessage[];
    static get readMessage(): HomeMessage[] {
        if (isEmpty(MessageLooper._readMsgs)) {
            MessageLooper.readMessage = []//conversations
        }
        return MessageLooper._readMsgs;
    }

    static set readMessage(msges: HomeMessage[]) {
        MessageLooper._readMsgs = msges
    }



    async readLoopJob() {

        if (networkConnected() == false) { return; }
        this.lastMessageTime = new Date()

        const receiverId = this.getMsgIdentifier()
        if (receiverId == null) {
            // console.warn('no account login')
            return;
        }
        // console.warn("readLoopJob:"+this.server)
        let msgs = null
        try {
            msgs = await loopService(this.server + "/readMsg/" + receiverId)
        }
        catch (err) {
            return;
        }

        if (isEmpty(msgs)) {
            return;
        }
        // console.warn(`msgs:${JSON.stringify(msgs)}`)
        const code = msgs.code;

        if (code != 1) { return; }

        // const time = msgs.time
        const data = msgs.data
        const keys = Object.keys(data)




        const messages: HomeMessage[] = []



        keys.forEach((key) => {
            const item = JSON.parse(data[key]);
            // console.warn(item)

            if (item.type == MESSAGETYPE.user_chat) {

                const info = this.toChat(item, key)
                messages.push(info)
            }
            else if (item.type == MESSAGETYPE.user_sysEmail) {
                const info = this.toSysEmail(item, key)

                messages.push(info)
            }
            else if (item.type == MESSAGETYPE.user_web) {
                const info = this.toWebMessage(item, key)
                messages.push(info)
            }
            else if(item.type == MESSAGETYPE.user_park){
                const info = this.toPark(item,key)
                messages.push(info)
            }
            // else if(item.type == MESSAGETYPE.sys_bulletinWeb){
            //     const info = this.toWebBulletin(item,key)

            //     messages.push(info)
            // }
        })

        if (messages.length != 0) {

            EventRegister.emitEvent(messageEvent, messages)
        }


        this.msgRead(receiverId)



    }



    async readBulletin() {
        if (networkConnected() == false) { return }

        const last = await getlastBulletinTime()//'20190513120234'
        //console.warn("last:" + last)
        getNodeService(this.server + "/readBulletin/" + last).then(res => {
            const responseJson: RestfulJson = res as any
            if (responseJson.code != 1) {
                return;
            }

            const d = responseJson.data
            const write = d.write
            console.warn("write:" + write)
            saveLastBulletinTime(write)

            console.warn("====>" + JSON.stringify(responseJson))
            const keys = Object.keys(d)
            const bulletins = []
            keys.forEach(key => {
                if (key != 'write') {
                    const b = JSON.parse(d[key])

                    const title = b.title
                    const content = b.content
                    const url = b.url
                    const temp = this.toBulletin({ title, content,url }, key)
                    bulletins.push(temp)
                }

            })

            EventRegister.emitEvent(messageEvent, bulletins)


        })
    }



    toChat(item, key): HomeMessage {
        //console.warn("toemergency:"+JSON.stringify(item))
        const content = item.content
        return {
            id: key,
            type: item.type,
            senderId: item.senderId,
            // sender: item.sender,
            // senderKid: content.senderKid,
            senderName: item.sender,
            content,
            title: item.sender,
            strContent: content.strContent,
            chatType: content.chatType,
            read: false
        }
    }


    toPark(item,key):HomeMessage{
        const content = item.content
        return {
            id: key,
            type: item.type,
            senderId: item.senderId,
            senderName: item.sender,
            content,
            title: `你收到了${item.sender}的1个车位币`,
            strContent: content.strContent,
            read: false
        }
    }



    toBulletin(item, key): HomeMessage {
        return {
            id: key,
            type: MESSAGETYPE.sys_bulletin,
            url: item.url,
            title: item.title,
            content: item.content,
            read : false
        }
    }


    // toWebBulletin(item,key) : HomeMessage {
    //     return {
    //         id:key,
    //         type:MESSAGETYPE.sys_bulletinWeb,
    //         url:item.url,
    //         title:item.title,
    //         content:item.content
    //     }
    // }


    toSysEmail(item, key): HomeMessage {

        return {
            id: key,
            type: MESSAGETYPE.user_sysEmail,
            title: '系统邮件',
            content: item.content,
            read:false
        }
    }


    toWebMessage(item, key): WebMessage {
        console.warn(`toWebMessage:${JSON.stringify(item)}`)
        return {
            id: key,
            type: MESSAGETYPE.user_web,
            url: item.url,
            img: item.img,
            title: item.title,
            content: item.content,
            read : false
        }
    }




    async sendMessage(body) {

        const uid = this.getMsgIdentifier()
        body.senderId = uid

        await fetch(this.server + '/sendMsg', {//todo:超时处理
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })

    }

    /**
     * 
     * @param {*} chatType 1、文字，2、图片
     */
    async chat({ receiverId, message, chatType = 1 }) {

        // const uid = UserAccount.instance.accountHasLogined ? UserAccount.instance.id : KdNum.instance.uid;
        // let kdNumCode = '', senderKid = ''
        // if (UserAccount.instance.accountHasLogined) {
        //     const k = await getOnlinePrimaryKdNum()
        //     kdNumCode = k.code,
        //         senderKid = k.id
        // }
        // else {
        //     kdNumCode = KdNum.instance.code
        //     senderKid = KdNum.instance.id
        // }

        this.sendMessage({ type: MESSAGETYPE.user_chat, sender: UserAccount.instance.accountName, receiverId, content: { chatType, strContent: message } })
    }


    readParkMsg(){
        const now = new Date()
        if(!this.lastMessageTime){
            this.lastMessageTime = new Date()
        }
        const m = (now.getTime() - this.lastMessageTime.getTime())/(1000*60)
        
        if(m>=30){
            this.lastMessageTime = new Date()
            this.readLoopJob()
        }
        
    }



    msgRead(receiverId) { //设置信息已经阅读了

        fetch(this.server + '/msgRead', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ receiverId })
        })
    }



}



export function launchMessageLooper() {

    // let looper = null;
    const ml = MessageLooper.instance//new MessageLooper();
    
    ml.flag = "global"
    // looper = setInterval(() => {
    //     if (allComponentsHasMounted()) {
    //         clearInterval(looper)
    //         ml.startListen()
    //     }
    // }, 1000)
    ml.startListen()
}



export function readBulletin() {
    const ml = MessageLooper.instance
    setTimeout(() => {
        ml.readBulletin();
    }, 10000);
}