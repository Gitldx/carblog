import { getDeviceId } from '../uitls/common'
import { getStorageAsync, isEmpty } from '../uitls/common'

import { postService, userAccountRegisterUrl, userAccountLoginUrl, RestfulJson, rj } from '../uitls/httpService'
// import { KdNum } from './KdNum'
// import { UserState } from './UserState'
// import { AccountState } from './AccountState'
// // import { Hybrid_AccountState } from './Hybrid_AccountState'
// // import { KdNumState } from './KdNumState'
// // import { Hybrid_KdNumState } from './Hybrid_KdNumState'
// import { EmptyState } from './EmptyState'

// import { savePrimaryKdNum, savePrimaryKdNumAsync } from '../../common/storage/primaryKdNumStorage';
import { simpleAlert } from '../uitls/alertActions';
import { globalFields } from '../model/global';
import { UserState } from './userState';
import { AccountRoleType } from './type';
import { PedestrianState } from './pedestrianState';
import { DriverState } from './driverState';
import { EmptyState } from './emptyState';
import { string } from 'prop-types';
import { updateGlobalUserAccount, saveUserAccountLocally } from './functions';
import { ImageSource } from '@src/assets/images';


declare var global: globalFields

// type Role = 0|1|2//"visitor" | "driver" | "pedestrian"

export class UserAccount {
    static storageKey = 'ua'
    id: string = ''
    deviceId = ''
    accountName = ''

    password = ''
    accountHasLogined = false //标识已注册用户是否登录
    role: AccountRoleType = 0

    nickname = ""
    phone: string = ""
    carNumber: string = ""
    image: string = null

    totalProducedMoney: number;
    totalGiftMoney: number;
    parkMoney: number;

    constructor(id?: string, deviceId?: string, accountName?: string, password?: string, accountHasLogined?: boolean, role?: AccountRoleType) {
        if (!arguments.length) {//无参构造通过本地存储数据创建实例后赋予全局user
        }
        else {
            this.id = id
            this.deviceId = deviceId
            this.accountName = accountName
            this.password = password
            this.accountHasLogined = accountHasLogined
            this.role = role
        }

    }


    initInfo({ nickname, phone, carNumber }) {
        this.nickname = nickname
        this.phone = phone
        this.carNumber = carNumber
    }

    setInfo({ nickname, phone, carNumber, role }) {
        this.nickname = nickname
        this.phone = phone
        this.carNumber = carNumber
        
        this.role = role
        
        console.warn(`setInfo:${JSON.stringify(this)}`)
        saveUserAccountLocally(this)

    }


    static getUid(): string {
        if (UserAccount.instance.accountHasLogined) {
            return UserAccount.instance.id;
        }
        else {
            return null;
        }
    }


    static get instance(): UserAccount {

        if (!global.user) {
            global.user = new UserAccount()
        }

        return global.user;
    }


    static async loginWithAccount(accountName: string, password: string, callback: (data: any) => void) {

        // const existKdnum = await KdNum.existLocalKdNum()
        const machineId = getDeviceId()

        try {
            const rr = await postService(userAccountLoginUrl(), { accountName, password });
            // console.warn(`rj:${JSON.stringify(rj)}`)


            if (rj(rr).ok) {

                if (rj(rr).code == 0) {
                    const data = rj(rr).data

                    const role: AccountRoleType = data.role
                    const ua = new UserAccount(data.id, null, accountName, password, true, role)
                    ua.initInfo({ nickname: data.nickname, phone: data.phone, carNumber: data.carNumber })

                    let newState = undefined
                    if (role == 1) {
                        newState = new DriverState(ua)
                    }
                    else {
                        newState = new PedestrianState(ua)

                    }
                    UserState.instance.transfer(newState)

                    // updateGlobalUserAccount(ua, true)
                    // await saveUserAccountLocally(ua)

                    callback({ id: data.id/* data.id */ })

                    
                }
                else {
                    simpleAlert(null, rj(rr).message)
                    callback(false)
                }

            }

        } catch (err) {
            simpleAlert(null, "useraccount login" + JSON.stringify(err))
        }

        return false;



    }



    async logout() {
        await UserState.instance.transfer(new EmptyState(new UserAccount()))//todo: 测试一下
        // this.accountHasLogined = false
        // await saveUserAccountLocally(this)
    }




    static async loginWithLocalAccount(accountName: string, password: string) {

        if (isEmpty(accountName) || isEmpty(password)) {
            return null
        }


        try {
            const rr = await postService(userAccountLoginUrl(), { accountName, password });


            if (rj(rr).ok) {

                if (rj(rr).code == 0) {
                    const data = rj(rr).data//rj.returnData

                    return data;
                }
                else {
                    simpleAlert(null, rj(rr).message)
                }

            }

        } catch (err) {
            simpleAlert(null, "useraccount login" + JSON.stringify(err))
        }

        return null;



    }


    static async serverLogin() {

        const data = await UserAccount.loginWithLocalAccount(UserAccount.instance.accountName, UserAccount.instance.password)

        return !isEmpty(data)
    }





    async register(accountName: string, password: string, role: AccountRoleType, successcallback: (any) => void) {



        const machineId = getDeviceId()

        try {
            const rr = await postService(userAccountRegisterUrl(), { accountName, password, role })
            console.warn(`rj:${JSON.stringify(rr)}`)

            if (rj(rr).ok) {
                if (rj(rr).code == 0) {
                    const id = rj(rr).data;
                    const ua = new UserAccount(id, null, accountName, password, true, role)
                    let newState = undefined
                    if (role == 2) {
                        newState = new PedestrianState(ua)
                    }
                    else {
                        newState = new DriverState(ua)
                    }
                    UserState.instance.transfer(newState)
                    // updateGlobalUserAccount(ua, true)
                    // await saveUserAccountLocally(ua)


                    successcallback(ua);
                }
                else if (rj(rr).code == 1) {
                    simpleAlert(null, rj(rr).message)
                }

            }
        }
        catch (err) {
            simpleAlert(null, "useraccount" + JSON.stringify(err))
        }


        // postService(userAccountRegisterUrl(), {
        //     accountName, password, machineId, kuid
        // }).then(rj => {

        // }).catch(err => {
        //     alert("useraccount" + JSON.stringify(err))
        // })


    }




    static async getLocalAccount(): Promise<UserAccount> {
        const result = await getStorageAsync(UserAccount.storageKey)

        if (result.isOk) {
            if (!isEmpty(result.data)) {
                return result.data
            }
            else {
                return null
            }
        }
        else {
            simpleAlert(null, '读取本地存储错误')
        }
    }


    static async existLocalAccount() {
        const localUa = await UserAccount.getLocalAccount()
        if (localUa) {
            return !isEmpty(localUa)
        }
        else {
            return false
        }


    }

}
