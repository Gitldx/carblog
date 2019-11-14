import {Linking, Platform} from 'react-native'
//transit 公交
//navigation 导航（百度）
//driving 驾车
//walking 步行
// amap:t = 0（驾车）= 1（公交）= 2（步行）= 3（骑行）= 4（火车android）= 5（长途客车android）
export default class MapLinking {
    static  Mode = {
        TRANSIT: {baidu: "transit", qMap: "bus", amap: 1},
        DRIVING: {baidu: "driving", qMap: "drive", amap: 0},
        WALKING: {baidu: "walking", qMap: "walk", amap: 2},
        RIDING: {baidu: "riding", qMap: "bike", amap: 3},
        NAVIGATION: {baidu: "navigation", qMap: "drive", amap: 0},
    };
    static isInstallAmap = () => {
        return new Promise((resolve, reject) => {
            Linking.canOpenURL(Platform.OS === "android" ? "androidamap://navi" : "iosamap://navi").then(supported => {
                console.warn("--------------:isInstallAmap", supported)

                resolve(supported)
            }).catch(err => {
                resolve(false)
            })
        })
    }


    static isInstallBaiDuMap = () => {
        return new Promise((resolve, reject) => {
            Linking.canOpenURL("baidumap://map/navi").then(supported => {
                resolve(supported)
                console.warn("--------------:", supported)
            }).catch(err => {
                console.warn("-------------11:", err)
                resolve(false)
            })
        })
    }
    static isInstallQQMap = () => {
        return new Promise((resolve, reject) => {
            Linking.canOpenURL("qqmap://map/routeplan").then(supported => {
                resolve(supported)
            }).catch(err => {
                resolve(false)
            })
        })
    }
    /**
     * 打开高德地图导航
     * @param {String} data.sname - 起点名字.
     * @param {String} data.sourceApplication - 应用名字.
     * @param {String|number} data.slon - 起点经度.
     * @param {String|number} data.slat - 起点纬度.
     * @param {String} data.dname - 终点名字.
     * @param {String|number} data.dlon - 终点经度.
     * @param {String|number} data.dlat - 终点纬度.
     * @param{Mode} data.mode 导航类型
     * @param data
     *
androidamap://navi?sourceApplication=我和车&poiname=fangheng&lat=36.547901&lon=104.258354&dev=0
iosamap://navi?sourceApplication=我和车&poiname=fangheng&poiid=BGVIS&lat=36.547901&lon=104.258354&dev=0
     */
    /* static openAmap = (data = {}) => {
        let base = Platform.OS === "android" ? "amapuri://route/plan/?" : "iosamap://path?"
        return new Promise((resolve, reject) => {
            base+=`sourceApplication=${data.sourceApplication||"test"}`
            //起点经纬度不传，则自动将用户当前位置设为起点
            if (!data.dlat || !data.dlon) {
                reject("需要终点经纬度")
            } else {
                if (data.slon && data.slat) {
                    base += `&slat=${data.slat}&slon=${data.slon}`
                }
                if (data.sname) {
                    base += `&sname=${data.sname}`
                }
                if (data.dname) {
                    base += `&dname=${data.dname}`
                }
                base += `&dlat=${data.dlat}&dlon=${data.dlon}&dev=0&t=${data.mode ? (data.mode.amap || 0) : 0}`
                Linking.openURL(base).then(res => {
                    resolve("打开成功")
                }).catch(err => {
                    reject("暂无安装高德地图")
                })
            }
        });
    } */

    static openAmap = (data :{lat:number,lng:number}) => {
        let base = Platform.OS === "android" ? "androidamap://navi?sourceApplication=我和车" : "iosamap://navi?sourceApplication=我和车"
        return new Promise((resolve, reject) => {
        
                base += `&lat=${data.lat}&lon=${data.lng}&dev=0`
                console.warn(base)
                Linking.openURL(base).then(res => {
                    resolve("打开成功")
                }).catch(err => {
                    resolve(JSON.stringify(err))
                    // resolve("暂无安装高德地图")
                })
            
        });
    }

    /**
     * 打开腾讯地图导航
     * @param {String} data.sname - 起点名字.
     * @param {String|number} data.slon - 起点经度.
     * @param {String|number} data.slat - 起点纬度.
     * @param {String} data.dname - 终点名字.
     * @param {String|number} data.dlon - 终点经度.
     * @param {String|number} data.dlat - 终点纬度.
     * @param{Mode} data.mode 导航类型
     * @param data
     * 
     * qqmap://map/routeplan?type=drive&from=清华&fromcoord=39.994745,116.247282&to=怡和世家&tocoord=39.867192,116.493187&referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
     */
    // static openQQMap = (data = {}) => {
    //     let base = "qqmap://map/routeplan？"
    //     return new Promise((resolve, reject) => {
    //         //起点经纬度不传，则自动将用户当前位置设为起点
    //         if (!data.slat || !data.slon || !data.dlat || !data.dlon) {
    //             reject("需要起点终点经纬度")
    //         } else {
    //             if (data.sname) {
    //                 base += `&from=${data.sname}`
    //             }
    //             base += `&fromcoord=${data.slat},${data.slon}&tocoord=${data.dlat},${data.dlon}`
    //             if (data.dname) {
    //                 base += `&to=${data.dname}`
    //             }
    //             base += `&type=${data.mode ? (data.mode.qMap || "drive") : "drive"}`
    //             Linking.openURL(base).then(res => {
    //                 resolve("打开成功")
    //             }).catch(err => {
    //                 resolve("暂无安装腾讯地图")
    //             })
    //         }
    //     });
    // }

    static openQQMap = (data : {slat:number,slng : number,dlat:number,dlng : number}) => {
        let base = "qqmap://map/routeplan?type=drive&"
        return new Promise((resolve, reject) => {
            
                base += `&fromcoord=${data.slat},${data.slng}&tocoord=${data.dlat},${data.dlng}`
                Linking.openURL(base).then(res => {
                    resolve("打开成功")
                }).catch(err => {
                    resolve("暂无安装腾讯地图")
                })
            
        });
    }

    /**
     * 打开百度地图导航
     * @param {String} data.sname - 起点名字.
     * @param {String|number} data.slon - 起点经度.
     * @param {String|number} data.slat - 起点纬度.
     * @param {String} data.dname - 终点名字.
     * @param {String|number} data.dlon - 终点经度.
     * @param {String|number} data.dlat - 终点纬度.
     * @param{Mode} data.mode 导航类型
     * @param data
     */
    s/* tatic openBaiDuMap = (data = {}) => {
        let base = "baidumap://map/direction?"
        return new Promise((resolve, reject) => {
            //起点经纬度不传，则自动将用户当前位置设为起点
            if (!data.dlat || !data.dlon) {
                reject("需要终点经纬度")
            } else if (!data.dname && !data.dlon && !data.slat) {
                reject("需要传终点名称或者经纬度")
            } else {
                if (data.slon && data.slat) {
                    base += `origin=name:${data.sname}|latlng:${data.slat},${data.slon}`
                } else {
                    base += `origin=${data.sname}`
                }

                if (data.dlon && data.dlat) {
                    base += `&destination=name:${data.dname}|latlng:${data.dlat},${data.dlon}`
                } else {
                    base += `&destination=${data.dname}`
                }
                base += `&mode=${data.mode ? (data.mode.baidu || "driving") : "driving"}`
                Linking.openURL(base).then(res => {
                    resolve("打开成功")
                }).catch(err => {
                    reject("暂无安装百度地图")
                })
            }
        });
    } */

//baidumap://map/navi?location=40.057023,116.307852&coord_type=bd09ll&type=BLK&src=ios.baidu.openAPIdemo
    static openBaiDuMap = (data :{lat:number,lng:number}) => {
        let base = "baidumap://map/navi?"
        return new Promise((resolve, reject) => {
            
                base += `location=${data.lat},${data.lng}&coord_type=gcj02&src=ios.zenger.carBlog`
                Linking.openURL(base).then(res => {
                    resolve("打开成功")
                }).catch(err => {
                    reject("暂无安装百度地图")
                })
            
        });
    }

}