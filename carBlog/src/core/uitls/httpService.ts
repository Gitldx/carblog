import { Platform, Alert } from 'react-native'
import { isEmpty, toDate, showNoNetworkAlert } from "./common";
import { getOnlineOffline, networkConnected } from "./netStatus";
import { getJIP, getNIP } from "./readParameter";
import { SPRINGWEBSERVICEVERSION ,NODEWEBSERVICEVERSION} from './constants';

import { globalFields } from '../model';
import { simpleAlert } from './alertActions';

declare var global: globalFields

export const NOTONLINE = "notOnline"

export function rj(rr: RestfulResult) {
    return rr as RestfulJson
}

export function rrnol(rr: RestfulResult) {
    return rr == NOTONLINE
}

export interface RestfulJson {
    ok: boolean,
    data: any,
    code: number,
    message: string
}

export interface NodeSerivceJson {
    code: number,
    time: string,
    data: any
}


export type RestfulResult = RestfulJson | "notOnline" | boolean

function http(): string {
    return 'http://' + getIp()
}


const delay = (timeOut: number = 10 * 1000): Promise<RestfulResult> => {//todo:post,put,delete也要做超时处理
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('网络超时'));
        }, timeOut);
    })
}


/**
 * 
 * @param {*} url 
 * @param {*} body 
 * @param {*} responseType text/plain,application/json 等
 */
export function postService(url: string, body: {}, version: string = SPRINGWEBSERVICEVERSION): Promise<RestfulResult> {//todo:服务器关闭的情况



    return new Promise((resolve, reject) => {

        const isConnected = networkConnected()
        if (!isConnected) {
            showNoNetworkAlert()
            resolve(NOTONLINE)
            return;
        }

        getOnlineOffline((isOnline) => {
            if (!isOnline) {
                // Alert.alert("网络状况：" + isOnline);
                resolve(false)
            }
            else {
                fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'api-version': version
                    },
                    body: typeof body == 'string' ? body : JSON.stringify(body),
                })
                    .then((response) => {
                        const obj: RestfulJson = response.json() as any

                        //     if (obj.code == -1) {
                        //         simpleAlert(null, obj.message)

                        //         resolve(false)
                        //         return;
                        //     }
                        // }
                        return obj
                        //resolve(obj)
                    }).then((res) => {

                        resolve(res)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            }
        })


    })
}


/**
 * 
 * @param {*} url 
 * @param {*} body 
 * @param {*} responseType text/plain,application/json 等
 */
export function putService(url, body, version = SPRINGWEBSERVICEVERSION): Promise<RestfulResult> {
    return new Promise((resolve, reject) => {

        const isConnected = networkConnected()
        if (!isConnected) {
            showNoNetworkAlert()
            resolve(NOTONLINE)
            return;
        }

        fetch(url, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'api-version': version
            },
            body: JSON.stringify(body),
        })
            .then((response) => resolve(response.json()))
            .catch((err) => {
                reject(err)
            })
    })
}


/**
 * 
 * @param {*} url 
 * @param {*} body 
 * @param {*} responseType text/plain,application/json 等
 */
export function deleteService(url, body, version = SPRINGWEBSERVICEVERSION): Promise<RestfulResult> {
    return new Promise((resolve, reject) => {

        const isConnected = networkConnected()
        if (!isConnected) {
            showNoNetworkAlert()
            resolve(NOTONLINE)
            return;
        }

        fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'api-version': version
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                const obj: RestfulJson = response.json() as any

                if (obj.ok == false) {
                    if (obj.code == -1) {
                        simpleAlert(null, obj.message)
                        resolve(false)
                        return;
                    }
                }

                resolve(obj)
            })
            .catch((err) => {
                reject(err)
            })
    })
}



/**
 * 
 * @param {*} url 
 * @param {*} body 
 * @param {*} responseType text/plain,application/json 等
 */
export function getNodeService(url, version = NODEWEBSERVICEVERSION): Promise<NodeSerivceJson> {

    return Promise.race([getPromise(url, version), delay()]).then(obj => {
        return obj as any;
    }).catch(err => {
        if (err.message == "网络超时") {
            simpleAlert(null, err.message)
        }
    })

}


export function loopService(url, version = NODEWEBSERVICEVERSION): Promise<NodeSerivceJson> {

    return getPromise(url, version).then(obj => {
        return obj as any;
    }).catch(err => {
        // simpleAlert(null,err.message)
        console.warn(`loopService:${err.message}`)
    })

}



/**
 * 
 * @param {*} url 
 * @param {*} body 
 * @param {*} responseType text/plain,application/json 等
 */
export function getService(url, version = SPRINGWEBSERVICEVERSION, headers = {}): Promise<RestfulResult> {

    return Promise.race([getPromise(url, version, headers), delay()]).then(obj => {
        return obj as any;
    }).catch(err => {
        if (err.message == "网络超时") {
            simpleAlert(null, err.message)
        }
    })//.then(()=>"timeout")

}


function getPromise(url, version, headers = {}): Promise<RestfulResult> {
    return new Promise((resolve, reject) => {

        const isConnected = networkConnected()
        if (!isConnected) {
            showNoNetworkAlert()
            resolve(NOTONLINE)
            return;
        }

        fetch(url, {
            // method: 'GET',
            headers: new Headers({
                'api-version': version,
                ...headers
            })
        })
            .then((response) => {

                const obj: RestfulJson = response.json() as any;

                if (obj.ok == false) {
                    if (obj.code == -1) {
                        simpleAlert(null, obj.message)

                        resolve(false)
                        return;
                    }
                }


                resolve(obj)


            })
            .catch((err) => {
                reject(err)
            })
    })
}





export function setIp(ip) {
    global.ip = ip;
}


export function getIp() {
    // return getJIP()
    return '129.28.152.138:8082'
    // return '192.168.0.102:8082'
    //return global.ip;
}


function getNodeIp() {
    //return 'http://192.168.0.103:3000'
    return 'http://' + getNIP()
}

function getImgIp() {
    return 'http://q1opwedmp.bkt.clouddn.com/' //'http://psnuywep3.bkt.clouddn.com/'
}


function getHelpUrl() {
    return getNodeIp() + '/help.html'
}


function geoMapUrl() {
    return Platform.select({
        ios: getNodeIp() + "/map_ios.html",
        android: getNodeIp() + '/map_android.html'
    })
}

function uploadImgUrl() {
    return http() + '/kdNum/uploadImg'
}

function uploadAvatarUrl() {
    return http() + '/kdNum/uploadAvatarqiniu'
}


function uploadRowImgUrl() {
    return http() + '/kdNum/uploadImgqiniu'
}


function imgUrl(path) {

    if (isEmpty(path)) {
        return ""
    }

    const arr = path.split("/")
    return http() + `/kdNum/img/${arr[0]}/${arr[1]}`
}


function bigHeadUrl(kdNumId) {

    if (isEmpty(kdNumId)) {
        return ""
    }

    const d = Date.now()
    return getImgIp() + kdNumId + `?v=${Number(toDate(d, "yyyyMMdd"))}&imageView2/0/w/500/h/500`
}


function avatarUrl(kdNumId) {

    if (isEmpty(kdNumId)) {
        return ""
    }

    const d = Date.now()
    return getImgIp() + kdNumId + `?v=${Number(toDate(d, "yyyyMMdd"))}&imageView2/0/w/120/h/120`
}


function qiniuThumbImgUrl(path) {

    if (isEmpty(path)) {
        return ""
    }

    // const arr = path.split("/")
    // console.warn(`qiniuThumbImgUrl${getImgIp() + arr[0] + "/t_" + arr[1]}`)

    // return getImgIp() + `${arr[0]}/t_${arr[1]}`
    return getImgIp() + `${path}?imageView2/` + "0/w/300/h/300"
}

function qiniuImgUrl(path) {

    if (isEmpty(path)) {
        return ""
    }

    // const arr = path.split("/")
    return getImgIp() + path //`${arr[0]}/${arr[1]}`
}


function qiniuDeleteImgUrl() {
    return http() + `/kdNum/deleteImgQiniu`
}


function getQiniuTokenUrl(key) {

    return http() + `/account/getQiniuImgKey?key=${key}`
}


function getQiniuAvatarTokenUrl(key) {
    return http() + `/kdNum/qiniuAvatarToken?key=${key}`
}


function userAccountRegisterUrl() {
    return http() + '/account/register'
}
function userAccountLoginUrl() {

    return http() + '/account/login'
}


function getUserAccountUrl(uid) {
    return http() + `/account/getUserAccount?uid=${uid}`
}


function setUserInfoUrl(previousImg: string) {
    return http() + `/account/setInfo?previousImg=${isEmpty(previousImg) ? "" : previousImg}`
}


function setUserCityCodeUrl(uid: string, citycode: number) {
    return http() + `/account/setUserCity?uid=${uid}&cityCode=${citycode}`
}


function getProfilesUrl() {
    return http() + "/account/getProfiles"
}

function getCommentsProfilesUrl() {
    return http() + "/account/getCommentsProfiles"
}


function getProfileUrl(uid: string) {
    return http() + `/account/getProfile?uid=${uid}`
}


function kdNumRegisterUrl(isAnonymous) {
    return http() + `/kdNum/register/${isAnonymous}`
}

function kdNumEditUrl() {
    return http() + '/kdNum/setKdNum'
}


function sellerConfigUrl() {
    return http() + '/kdNum/sellerConfig'
}

function extendServiceUrl(kdNumId) {
    return http() + `/kdNum/extendService/${kdNumId}`
}


function visitKdNumUrl(kdNumId) {
    return http() + `/kdNum/visit/${kdNumId}`
}

function setTextRowTemplateUrl(kdNumId, crud) {
    return http() + `/kdNum/setTextRowTemplate?kdNumId=${kdNumId}&crud=${crud}`
}

function setImgRowTemplateUrl(kdNumId, crud) {
    return http() + `/kdNum/setImgTemplate?kdNumId=${kdNumId}&crud=${crud}`
}


function deleteRowTemplateUrl(type, kdNumId, rowId) {
    const t = '/kdNum/deleteTextTemplate'
    const i = '/kdNum/imgTemplate'
    return http() + `${type == 'text' ? t : i}?kdNumId=${kdNumId}&rowId=${rowId}`
}


function getKdNumsUrl(uid) {
    return http() + `/kdNum/findAllByUid/${uid}`
}


function getPrimaryKdNumUrl(uid) {
    return http() + `/kdNum/getPrimaryKdNum/${uid}`
}


function getKdNumByMachineId(mid) {
    return http() + `/kdNum/findKdNumByMachineId/${mid}`
}


function searchKdNumUrl(code) {
    return http() + `/kdNum/search?code=${code}`
}


function existsKdNumCodeUrl(code) {
    return http() + `/kdNum/existsByCode/${code}`
}

function searchKdNumInArrayUrl(codes) {
    const str = codes.join(",")
    return http() + `/kdNum/searchInArray?codes=${str}`
}


function searchByTags(tags, page) {
    const str = tags.join(",")
    return http() + `/kdNum/searchByTags?tags=${str}&page=${page}`
}


function geoSearchUrl({ tags, lng, lat, maxDistance, minDistance }) {
    const str = tags.join(",")
    return http() + `/kdNum/geosearch?tags=${str}&lng=${lng}&lat=${lat}&maxDistance=${maxDistance}&minDistance=${minDistance}`
}


function searchForDeal(code, page) {
    return http() + `/kdNum/searchForDeal?code=${code}&page=${page}`
}


function listForDealUrl() {
    return http() + "/kdNum/listTopForSell"
}


function buySellingKdNumUrl(price, buyerUid) {
    return http() + `/kdNum/BuySellingKdNum?price=${price}&buyerUid=${buyerUid}`
}


function getBargainRecordUrl(uid) {
    return http() + `/kdNum/getBargainRecord/${uid}`
}


function bargainUrl() {
    return http() + "/kdNum/bargain"
}


function deleteBargainUrl(barginId) {
    return http() + `/kdNum/deleteBargainRecord/${barginId}`
}



function bargainAgreeUrl() {
    return http() + "/kdNum/bargainAgree"
}


function addFriendUrl(uid, kdNumId, toUid, primaryKdNumId) {
    return http() + `/account/addFriend/${uid}/${kdNumId}/${toUid}/${primaryKdNumId}`
}


function deleteFriendUrl(uid, kdNumId) {
    return http() + `/account/deleteFriend/${uid}/${kdNumId}`
}


function getMyFriendsUrl(uid) {
    return http() + `/account/getMyFriends/${uid}`
}


function addCredit() {
    return http() + `/account/addCredit`
}


function getCreditAmount(uid) {
    return http() + `/account/getCredit/${uid}`
}


function setPhoneBusyUrl() {

    return http() + `/kdNum/setPhoneBusy`
}


function getPhoneBusyInfoUrl(id) {

    return http() + `/kdNum/getPhoneBusyInfo/${id}`
}


function getInviteCodeUrl() {
    return http() + "/account/genInviteCode/"
}

function existInvitorUrl(inviteCode) {
    return http + `/account/existInvitor/${inviteCode}`
}

function inviteDecodeUrl(code) {
    return http() + `/account/inviteDecode/${code}`
}


function inviteGetCodeUrl(id) {
    return http() + `/account/inviteGetcode/${id}`
}


function setInviteCodeUrl(uid, inviteCode) {
    return http() + `/account/setInviteCode/${uid}/${inviteCode}`
}


function setInvitorUrl(uid, inviteCode) {
    return http() + `/account/setInvitor/${uid}/${inviteCode}`
}


function addSharedCountUrl(inviteCode) {
    return http() + `/account/addSharedCount/${inviteCode}`
}


function decrSharedCountUrl(inviteCode) {
    return http() + `/account/decrSharedCount/${inviteCode}`
}

function decrSharedCountByUrl(inviteCode, num) {
    return http() + `/account/decreaseSharedCountBy/${inviteCode}/${num}`
}


function getSharedFriendsUrl(inviteCode) {
    return http() + `/account/getSharedFriends/${inviteCode}`
}


function totalSharedUrl(inviteCode) {
    return http() + `/account/totalShared/${inviteCode}`
}



function commitReportUrl() {
    return http() + '/account/report'
}



function setBasicInfoUrl() {
    return http() + "/account/setBasicInfo"
}


function parkUrl(minutes) {
    return http() + `/park/doPark/${minutes}`
}


function searchParkByCarNumberUrl(carNumber) {
    return http() + `/park/searchCarNumber/${carNumber}`
}


function parkGetUrl(uid: string) {
    return http() + `/park/get/${uid}`
}


function shareParkUrl() {
    return http() + `/park/sharePark`
}


function getNearestPointUrl(lng, lat, deviation: number) {
    return http() + `/park/matchParkPoint?lng=${lng}&lat=${lat}&deviation=${deviation}`
}


function matchShareParkPointUrl(lng, lat, deviation: number) {
    return http() + `/park/matchShareParkPoint?lng=${lng}&lat=${lat}&deviation=${deviation}`
}


function rankParkUrl(citycode, sortType, page) {
    return http() + `/park/rankPark?cityCode=${citycode}&sortType=${sortType}&page=${page}`
}


function searchNearParkUrl(lng, lat, page: number, uid: string, role: number) {
    return http() + `/park/searchNearPark?lng=${lng}&lat=${lat}&page=${page}&uid=${uid}&role=${role}`
}


function thankForParkUrl() {
    return http() + `/park/thank`
}


function driveUrl(id: string, uid: string) {
    return http() + `/park/drive/${id}/${uid}`
}


function searchCarNumberUrl(carNumber) {
    return http() + `/account/getProfileByCarNumber?carNumber=${carNumber}`
}


function extendParkUrl(id, minutes) {
    return http() + `/park/extendPark/${id}/${minutes}`
}


function writeArticleUrl() {
    return http() + `/article/add`
}

function updateArticleUrl(previousImg: string) {

    return http() + `/article/update?previousImg=${isEmpty(previousImg) ? "" : previousImg}`
}

function deleteArticleUrl(id:string) {
    return http() + `/article/delete/${id}`
}

function readArticleUrl(id: string) {
    return http() + `/article/read/${id}`
}

function addArticleVisitCountUrl(id: string) {
    return http() + `/article/readInc/${id}`
}

function listArticleUrl(page: number) {
    return http() + `/article/list/${page}`
}


function getProfileByCarNumberUrl(carNumber: string) {

    return http() + `/account/getProfileByCarNumber?carNumber=${carNumber}`
}


function listNearbyArticleUrl(lng: number, lat: number, page: number) {
    return http() + `/article/listNear?lng=${lng}&lat=${lat}&page=${page}`
}


function listMyArticlesUrl(uid: string) {
    return http() + `/article/listMyBlogs/${uid}`
}


function commentUrl(articleId: string) {
    return http() + `/article/comment/${articleId}`
}


function likeArticleUrl(uid: string, articleId: string) {
    return http() + `/article/likeArticle/${articleId}/${uid}`
}



function likeCommentUrl(uid: string, articleId: string, index: number) {
    return http() + `/article/likeComment/${articleId}/${index}?liker=${uid}`
}


function shopListUrl(page: number) {
    return http() + `/shop/list/${page}`
}


function shopGetUrl(id: string) {
    return http() + `/shop/get/${id}`
}


function shopGetByUid(uid: string) {
    return http() + `/shop/findByUid/${uid}`
}


function shopEditUrl() {
    return http() + `/shop/edit`
}


function shopCollectUrl(uid: string, shopUid: string) {
    return http() + `/shop/collect/${uid}/${shopUid}`
}

function shopUncollectUrl(uid: string, shopUid: string) {
    return http() + `/shop/uncollect/${uid}/${shopUid}`
}

function productAddUrl(uid: string) {
    return http() + `/shop/product/add`
}

function productEditUrl() {
    return http() + `/product/edit`
}

function productDeleteUrl(uid: string, index: number) {
    return http() + `/shop/product/delete/${uid}/${index}`
}

function productShowUrl(uid: string, index: number) {
    return http() + `/shop/product/show/${uid}/${index}`
}

function productOpenUrl(id: string) {
    return http() + `/product/open/${id}`
}

function productCloseUrl(id: string) {
    return http() + `/product/close/${id}`
}

function productCollectUrl(uid: string, shopUid: string, index: number) {
    return http() + `/shop/product/collect/${uid}/${shopUid}/${index}`
}

function productUncollectUrl(uid: string, shopUid: string, index: number) {
    return http() + `/shop/product/uncollect/${uid}/${shopUid}/${index}`
}



function productListUrl(uid: string) {
    return http() + `/product/listByUid/${uid}`
}


function roadChatUrl(){
    return http() + `/road/chat`
}

function roadChatListUrl(cityCode,road,page,lng,lat){
    return http() + `/road/chatList/${cityCode}/${road}/${page}?lng=${lng}&lat=${lat}`
}


function countRoadChatUrl(cityCode,road){ //todo:去掉java多余的page path变量
    return http() + `/road/count/${cityCode}/${road}/0`
}


export {
    uploadImgUrl, uploadAvatarUrl, uploadRowImgUrl, imgUrl, avatarUrl, bigHeadUrl, qiniuThumbImgUrl, qiniuImgUrl, qiniuDeleteImgUrl, getQiniuTokenUrl, getQiniuAvatarTokenUrl,
    userAccountLoginUrl, userAccountRegisterUrl, getUserAccountUrl, setBasicInfoUrl, setUserInfoUrl, setUserCityCodeUrl,
    getProfilesUrl, getCommentsProfilesUrl, getProfileUrl,
    kdNumRegisterUrl, kdNumEditUrl, sellerConfigUrl, extendServiceUrl, visitKdNumUrl, existsKdNumCodeUrl,
    setTextRowTemplateUrl, setImgRowTemplateUrl, deleteRowTemplateUrl,
    getKdNumsUrl, getPrimaryKdNumUrl, searchByTags, geoSearchUrl, searchForDeal, listForDealUrl, getKdNumByMachineId, searchKdNumUrl, searchKdNumInArrayUrl,
    buySellingKdNumUrl, bargainUrl, bargainAgreeUrl, getBargainRecordUrl, deleteBargainUrl,
    addFriendUrl, deleteFriendUrl, getMyFriendsUrl,
    addCredit, getCreditAmount,
    setPhoneBusyUrl, getPhoneBusyInfoUrl,
    inviteDecodeUrl, inviteGetCodeUrl, getInviteCodeUrl, setInviteCodeUrl, setInvitorUrl, addSharedCountUrl, decrSharedCountUrl, decrSharedCountByUrl,
    existInvitorUrl, getSharedFriendsUrl, totalSharedUrl,
    commitReportUrl, geoMapUrl, getHelpUrl,
    parkUrl, searchParkByCarNumberUrl, driveUrl, parkGetUrl, searchCarNumberUrl, extendParkUrl, shareParkUrl, getNearestPointUrl, searchNearParkUrl,
    thankForParkUrl, matchShareParkPointUrl, rankParkUrl,

    writeArticleUrl, updateArticleUrl, deleteArticleUrl, listArticleUrl, getProfileByCarNumberUrl, listNearbyArticleUrl, listMyArticlesUrl,
    readArticleUrl, addArticleVisitCountUrl, commentUrl, likeArticleUrl, likeCommentUrl,
    shopListUrl, shopGetUrl, productListUrl, shopGetByUid, shopEditUrl, productEditUrl, productCloseUrl, productOpenUrl,
    roadChatUrl,roadChatListUrl,countRoadChatUrl
}