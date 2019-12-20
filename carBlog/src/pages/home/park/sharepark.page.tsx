import React from 'react';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, CheckBox, Radio, Tooltip, } from 'react-native-ui-kitten';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import { Input, ScrollableAvoidKeyboard } from '@src/components/common';
import { MaterialCommunityIcons, ArrowIosBackFill } from '@src/assets/icons';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { Config } from '@src/core/uitls/config';
import { TopNavigationOptions } from '@src/core/navigation/options';
import { ShopList } from '../shopList.componen';
import { SearchPlaceholder, FormRow } from '@src/components';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { postService, parkUrl, getService, shareParkUrl, getNearestPointUrl, rj } from '@src/core/uitls/httpService';
import { toDate, isEmpty, gcj2wgs, timeDiffInSeconds, showNoAccountOnAlert, showNoNetworkAlert } from '@src/core/uitls/common';
import Amap from '@src/components/amap'
import { PermissionsAndroid } from "react-native";
import { init, Geolocation, getDistance } from "@src/components/amap/location";
import { Park } from '@src/core/model';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { OffStreetPark, SharePark as ShareParkModel } from '@src/core/model/park';
import { ParkItem } from './type';
import { simpleAlert } from '@src/core/uitls/alertActions';
import { NEARDEVIATION } from '@src/core/uitls/constants';
import { saveLastLocation, getLastLocation, LocationStorage } from '@src/core/uitls/storage/locationStorage';
import { showMessage } from 'react-native-flash-message';
import {Toast,DURATION,COLOR} from '@src/components'
import { getSevertimeDiff } from '@src/core/uitls/readParameter';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { networkConnected } from '@src/core/uitls/netStatus';




type Props = ThemedComponentProps & NavigationScreenProps

type State = {
    forfree: boolean,
    parkType: number,//0:路边停车场，1:路外停车场
    parkName: string,
    parkNumber: string,
    info: string,
    mapHeight: number,
    mapShow: boolean,
    initLatitude: number,
    initLongitude: number,
    selectedAddress: string,
    tooltipVisible: boolean,
    limitRegion: any
}

// const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

class SharePark extends React.Component<Props, State> {

    // static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {

    //   const headerTitle = ()=>{
    //     return (
    //       <View style={{flex:1,alignItems:'center'}}>
    //         <Text>首页</Text>
    //       </View>


    //     )
    //   }

    //   const headerStyle = {
    //     backgroundColor: getThemeValue("background-basic-color-1",themes[Config.currentTheme]),
    //     height : 56
    //   }

    //   return { 
    //     ...navigation,...screenProps,
    //     headerTitle,
    //     headerStyle
    //    };
    // }; 

    static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
        return {

            title: '分享车位'
        }
    }


    private selectedPoint: { lat: number, lng: number }
    private currentPark: ShareParkModel
    private currentOffStreetPark: OffStreetPark


    private keyboardOffset: number = Platform.select({
        ios: 40,
        android: 30,
    });


    public state: State = {
        forfree: false,
        parkType: 0,
        parkName: "",
        parkNumber: "1",
        info: "",
        mapHeight: 0,
        mapShow: false,
        initLatitude: null,
        initLongitude: null,
        selectedAddress: '',
        tooltipVisible: false,
        limitRegion: null
    }


    private parkId: string

    private toast : Toast


    private onSearchPressed = () => {

        this.props.navigation.navigate("SearchCar")
    }

    private goBack = () => {
        this.props.navigation.goBack(KEY_NAVIGATION_BACK)
    }

    private renderSearchBar = () => {
        const { themedStyle } = this.props
        return (
            <View style={themedStyle.searchBar}>
                <Button size="giant" appearance="ghost" icon={ArrowIosBackFill} onPress={this.goBack} />
                <Input style={{ flex: 1 }} placeholder="输入车牌号，通知车主挪车" />
                <Button appearance="ghost">搜索</Button>
            </View>

        )
    }




    private publish = async () => {//todo:重复提交的问题，似乎还是会删掉附近的固定停车位

        if(!networkConnected()){
            showNoNetworkAlert()
            return
        }


        const s = onlineAccountState()
        if(s == 0 || s == -1){
            showMessage({
                message: "提示",
                description: "登录账号再分享信息，可以获得积分，点击查看游戏规则",
                position: 'center',
                type: 'info',
                icon: "info",
                floating: true,
                duration: 10000,
                onPress:()=>{this.props.navigation.navigate("MyScore")}
            })
            return;
        }

        const lastLocation: LocationStorage = await getLastLocation()
        
        if (lastLocation) {
            const distance = await getDistance({ latitude: this.state.initLatitude, longitude: this.state.initLongitude },
                { latitude: lastLocation.lat, longitude: lastLocation.lng })

            // console.warn(`distance:${distance},lasttime:${lastLocation.time}`)

            // if (distance < NEARDEVIATION && (timeDiffInSeconds(new Date(), new Date(lastLocation.time)) / 60) <= 5) {
            //     simpleAlert(null, "你已经在此地点发布过信息，请移步到其他地点发布，或者5分钟后再刷新")
            //     return;
            // }//todo:记得去掉注释
        }

        // return;
        const { lng, lat } = gcj2wgs(this.selectedPoint.lng, this.selectedPoint.lat)
        const location = { coordinates: [lng, lat] }
        const gcjLocation = [this.selectedPoint.lng, this.selectedPoint.lat]
        const streetName = this.state.selectedAddress
        const forFree = this.state.forfree

        let shareParkId = null
        // console.warn(JSON.stringify(this.currentPark))
        if (this.currentPark) {
            const serverTimeDiff = await getSevertimeDiff()
            const diffMinutes = serverTimeDiff + timeDiffInSeconds(new Date(), new Date(this.currentPark.publishTime)) / 60
            console.warn(`diffMinutes:${diffMinutes}`)
            if (diffMinutes <= 5) {
                simpleAlert(null, "该停车点刚才已有人发布，请5分钟后再刷新信息")
                return;
            }

            // return;
            shareParkId = this.currentPark.id
        }

        let offStreetPark: OffStreetPark = null
        if (this.state.parkType == 1) {
            let _id = null;
            if (this.currentOffStreetPark) {//修改模式
                _id = this.currentOffStreetPark.id
            }
            offStreetPark = { id: _id, parkName: this.state.parkName, location, gcjLocation, streetName, forFree }
        }
        else if (this.state.parkType == 0 && this.currentOffStreetPark) {//需要删除掉路外停车场数据
            offStreetPark = this.currentOffStreetPark
            offStreetPark.parkName = null
        }



        const data: { sharePark: ShareParkModel, offStreetPark?: OffStreetPark } = {
            sharePark: {
                id: shareParkId, uid: UserAccount.getUid(), offStreetParkId: null, parkNumber: this.state.parkNumber, streetName,
                forFree, note: this.state.info, publishTime: null,
                location, gcjLocation
            },
            offStreetPark
        }
        const rr = await postService(shareParkUrl(), data)

        

        const rjData: { sharePark: ShareParkModel, offStreetPark: OffStreetPark } = rj(rr).data
        this.currentPark = rjData.sharePark;
        this.currentOffStreetPark = rjData.offStreetPark;

        saveLastLocation({ lat: this.state.initLatitude, lng: this.state.initLongitude, time: toDate(new Date(),"yyyy/MM/dd hh:mm:ss") })

        this.toast.show("分享成功",DURATION.LENGTH_SHORT,()=>{
            this.props.navigation.goBack(KEY_NAVIGATION_BACK)
        })
        // showMessage({
        //     message : "分享成功",
        //     type : "success",
        //     floating : true,
        //     position : "center"
        // })
        
    }




    private _onDidMoveByUser = (e) => {
        let { longitude, latitude, } = e.nativeEvent.data.centerCoordinate
        console.warn(longitude, "=", latitude)
    }

    private _onSingleTappedAtCoordinate = (e) => {
        let { longitude, latitude, } = e.nativeEvent.data.Coordinate
        console.warn(longitude, "=", latitude)
    }


    private onMapPressed = async (e) => {
        let { longitude, latitude, } = e.nativeEvent

        this.selectedPoint = { lat: latitude, lng: longitude };

        Geolocation.getReGeoCode({ latitude, longitude }, (result) => {
            this.setState({ selectedAddress: result.address })
        });

        this.matchPoint(longitude, latitude)

        // const distance = await getDistance({
        //     latitude: 22.633373,
        //     longitude: 113.83478
        // }, { latitude, longitude })

        // console.warn(distance)
    }


    private matchPoint = (longitude, latitude) => {
        const { lng, lat } = gcj2wgs(longitude, latitude)
        getService(getNearestPointUrl(lng, lat, NEARDEVIATION)).then((rj: any) => {
            const offStreets: ParkItem[] = rj.data.offStreet
            const shareParks: ParkItem[] = rj.data.sharePark
            // console.warn("--->"+JSON.stringify(rj.data.sharePark))
            if (shareParks.length > 0) {
                const myShare: ParkItem = shareParks.find(s => s.uid == UserAccount.getUid())
                if (myShare) {
                    const { forFree, parkNumber, note } = myShare
                    let parkType = 0
                    let parkName = ""
                    if (offStreets.length > 0) {
                        const offStreet = offStreets.find(osp => osp.id == myShare.offStreetParkId)
                        if (offStreet) {
                            parkType = 1
                            parkName = offStreet.parkName
                            this.currentOffStreetPark = offStreet
                        }
                    }
                    this.setState({ forfree: forFree, parkType, parkName, parkNumber: parkNumber.toString(), info: note })
                    this.currentPark = myShare
                }
            }
            else if (offStreets.length > 0) {
                this.currentPark = null

                const offStreetPark: ParkItem = offStreets[0]
                const { forFree, parkName } = offStreetPark
                this.setState({ forfree: forFree, parkName ,parkType : 1,parkNumber:"1",info:""})
                this.currentOffStreetPark = offStreetPark
            }
            else {
                this.currentPark = null
                this.setState({forfree:false,parkType:0,parkName:"",parkNumber:"1",info:""})
            }
        })
    }


    public async componentWillMount() {
        if (Platform.OS == "android") {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        }

        await init();

        Geolocation.getCurrentPosition(({ coords }) => {
            // console.warn("---->" + JSON.stringify(coords));
            // this.setState({ initLongitude: coords.longitude, initLatitude: coords.latitude })
            const { latitude, longitude } = coords
            // this.setState({ mapShow: true, initLongitude: longitude, initLatitude: latitude })

            this.selectedPoint = { lat: latitude, lng: longitude }

            Geolocation.getReGeoCode({
                latitude: latitude,
                longitude: longitude,
            }, (result) => {
                this.setState({ selectedAddress: result.address })
            });

            setTimeout(() => {
                this.setState({ mapShow: true, initLongitude: longitude, initLatitude: latitude }, () => {
                    setTimeout(() => this.setState({
                        limitRegion: {
                            latitude: this.state.initLatitude,
                            longitude: this.state.initLongitude, latitudeDelta: 0.004, longitudeDelta: 0.004
                        }
                    }), 1000)//todo:记得取消注释
                })
            }, 500);



            this.matchPoint(longitude, latitude)

        });





        this.props.navigation.setParams({ "onSearchPressed": this.onSearchPressed })
    }

    public async componentDidMount() {

        // const rj = await getService(parkGetUrl(UserAccount.getUid())) as RestfulJson



        // const p: Park = rj.data
        // this.parkId = p ? p.id : null
       

    }

    public renderMapview() {

        const props: any = Platform.select({
            ios: {},
            android: { hasScrollviewParent: true }
        })

        if (this.state.limitRegion) {
            props.limitRegion = this.state.limitRegion
        }



        return (
            <Amap ref="mapview" style={StyleSheet.absoluteFill}
                onlyOneMarker={true}
                addMarkerOnTap={true}
                showsZoomControls={true}
                showsCompass={true}
                minZoomLevel={16}
                zoomLevel={18}
                // scrollEnabled={false}
                // limitRegion={{
                //     latitude: 22.633373,
                //     longitude: 113.83478, latitudeDelta: 0.005, longitudeDelta: 0.005
                // }}

                coordinate={{
                    latitude: this.state.initLatitude,//22.633373,
                    longitude: this.state.initLongitude//113.83478
                }}

                {...props}
                // locationEnabled
                // onLocation={({ nativeEvent }) =>
                //     console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
                onPress={this.onMapPressed}
            >
                <Amap.Marker color="red"
                    active={true}
                    image="purplepin"
                    title="定位不准？手点地图"
                    // onPress={this._onMarkerPress}
                    coordinate={{
                        latitude: this.state.initLatitude,//22.633373,
                        longitude: this.state.initLongitude//113.83478
                    }}
                />
            </Amap>
        )
    }

    public render2() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderSearchBar()}
                <View style={{ width: "100%", height: 200 }}>
                    {
                        this.state.initLatitude == null ? null :
                            <Amap style={StyleSheet.absoluteFill}
                                showsZoomControls={true}
                                zoomLevel={18}
                                coordinate={{
                                    latitude: 22.536853,//this.state.initLatitude,//22.536853,
                                    longitude: 114.057108//this.state.initLongitude//114.057108
                                }}
                            // locationEnabled
                            // onLocation={({ nativeEvent }) =>
                            //     console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
                            >
                                <Amap.Marker color="red"
                                    image="purplepin"
                                    title="自定义图片"
                                    // onPress={this._onMarkerPress}
                                    coordinate={{
                                        latitude: 22.536853,//this.state.initLatitude,//22.536853,
                                        longitude: 114.057108//this.state.initLongitude//114.057108
                                    }}
                                />
                            </Amap>
                    }
                </View>
            </View>

        )
    }


    public render(): React.ReactNode {
        const { themedStyle } = this.props

        return (



            <ScrollableAvoidKeyboard style={themedStyle.container} extraScrollHeight={this.keyboardOffset}>
                {/* {this.renderSearchBar()} */}
                <Toast ref={elm=>this.toast = elm} style={{backgroundColor:COLOR.success}}/>

                <View style={{ paddingHorizontal: 16 }}>
                    <Text style={{ marginVertical: 10 }}>
                        标注停车地点
                    </Text>
                </View>
                <View style={{ marginBottom: 20, height: 300 }}>
                    {this.state.mapShow ? this.renderMapview() : null}
                    {/* <View style={{backgroundColor:'yellow',width:300,height:28,position:'absolute',zIndex:9999,bottom:0,left:0}}></View> */}
                </View>
                {
                    this.state.selectedAddress ?
                        <Text appearance="hint">{this.state.selectedAddress}</Text>
                        : null
                }
                <View>
                    <FormRow title="车位数量">
                        <View style={styles.form}>
                            <Input style={{ width: '100%' }} value={this.state.parkNumber} onChangeText={(val) => this.setState({ parkNumber: val })} />
                        </View>
                    </FormRow>
                    <FormRow title="停车费">
                        <View style={styles.form}>
                            <Radio
                                text="收费"
                                checked={!this.state.forfree}
                                onChange={() => this.setState({ forfree: false })}
                            />
                            <Radio
                                text="免费"
                                checked={this.state.forfree}
                                onChange={() => this.setState({ forfree: true })}
                            />
                        </View>
                    </FormRow>
                    <FormRow title="停车位类型">
                        <Radio
                            text="路边停车位"
                            checked={this.state.parkType == 0}
                            onChange={() => this.setState({ parkType: 0 })}
                        />
                        <Radio
                            text="路外停车场"
                            checked={this.state.parkType == 1}
                            onChange={() => this.setState({ parkType: 1 })}
                        />
                        <Tooltip textStyle={{ fontSize: 14 }} text="路外停车场一般指社会公共停车场，商场专用停车场，建筑物室内停车场等,通常有专人管理" placement="left" style={{ width: 220 }}
                            visible={this.state.tooltipVisible} onBackdropPress={() => this.setState({ tooltipVisible: false })}>
                            <TouchableOpacity onPress={() => this.setState({ tooltipVisible: true })}>
                                <MaterialCommunityIcons name="help-circle" size={20} color={getThemeValue("color-warning-default", themes['App Theme'])} />
                            </TouchableOpacity>
                        </Tooltip>

                    </FormRow>
                    {
                        this.state.parkType == 1 ?
                            <FormRow title="停车场名">
                                <Input placeholder="附属机构名或所在场地名" multiline={true} style={{ width: '100%' }} value={this.state.parkName} onChangeText={(val) => this.setState({ parkName: val })} />
                            </FormRow>
                            : null
                    }
                    <FormRow title="备注">
                        <View style={styles.form}>
                            <Input multiline={true} style={{ width: '100%' }} value={this.state.info} onChangeText={(val) => this.setState({ info: val })} placeholder="如有更多信息，请提供" />
                        </View>
                    </FormRow>



                    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        <View style={{ marginTop: 10 }}>
                            <Button onPress={this.publish}>发布</Button>
                            <Text style={{ textAlign: 'center', marginTop: 10 }} category="p1" appearance="hint" >分享快乐</Text>
                        </View>

                    </View>





                </View>
            </ScrollableAvoidKeyboard>

        );
    }


}



const styles = StyleSheet.create({
    form: {
        flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    }
});


export const ShareParkPage = withStyles(SharePark, (theme: ThemeType) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme['background-basic-color-1'],
    }
}));