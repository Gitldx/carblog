import React from 'react';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, CheckBox, } from 'react-native-ui-kitten';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import { PageView } from '../../pageView';
import { BlogList } from '../blogList.component';
import { ScrollPageView } from '../../scrollPageView';
import { ScrollView } from 'react-native-gesture-handler';
import { Input, ScrollableAvoidKeyboard } from '@src/components/common';
import { MaterialCommunityIcons, ArrowIosBackFill } from '@src/assets/icons';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { Config } from '@src/core/uitls/config';
import { TopNavigationOptions } from '@src/core/navigation/options';
import { ShopList } from '../shopList.componen';
import { SearchPlaceholder, FormRow, ContentBox, LicensePlate } from '@src/components';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { postService, parkUrl, getService, parkGetUrl, RestfulJson, driveUrl, deleteService, extendParkUrl, getNearestPointUrl, searchNearParkUrl, thankForParkUrl, matchShareParkPointUrl, searchParkByCarNumberUrl } from '@src/core/uitls/httpService';
import { toDate, isEmpty, gcj2wgs } from '@src/core/uitls/common';
import Amap from '@src/components/amap'
import { PermissionsAndroid } from "react-native";
import { init, Geolocation } from "@src/components/amap/location";
import { Park } from '@src/core/model';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { NEARDEVIATION } from '@src/core/uitls/constants';
import { ParkItem } from './type';
import { SharePark } from '@src/core/model/park';
import Dialog from 'react-native-dialog'
import { showMessage } from 'react-native-flash-message';
import { hasThanked } from './parkUtils';
import { Toast, DURATION, COLOR } from '@src/components'



type ThankDTO = {
    parkId: string
    senderName: string
    senderUid: string,
    thankText: string,
    uid: string
}


type Props = ThemedComponentProps & NavigationScreenProps

type State = {
    selectedIndex: number, blogListLoaded: boolean,
    carNumber: string, phone: string,
    status: number,
    stayTime: string, leaveTime: string, delayTime: string,
    btnText: string,
    mapHeight: number,
    initLatitude: number,
    initLongitude: number,
    nearParks: ParkItem[],
    searchResult: Park,
    searchText: string,
    dialogVisible: boolean,
    thankText: string
}

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

class Parking extends React.Component<Props, State> {

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

            title: '停车'
        }
    }

    private keyboardOffset: number = Platform.select({
        ios: 40,
        android: 30,
    });

    private toast: Toast


    public state: State = {
        selectedIndex: 0,
        blogListLoaded: false,
        carNumber: "",
        phone: "",
        status: 0,//0:开车状态，1:停车状态
        stayTime: null,
        leaveTime: "",
        delayTime: null,
        btnText: '停车',
        mapHeight: 0,
        initLatitude: null,
        initLongitude: null,
        nearParks: null,
        searchResult: undefined,
        searchText: "",
        dialogVisible: false,
        thankText: ''
    }


    private parkId: string

    private currentPosition: { longitude: number, latitude: number }

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
                <Input value={this.state.searchText} onChangeText={val => this.setState({ searchText: val })} style={{ flex: 1 }} placeholder="输入车牌号，通知车主挪车" />
                <Button appearance="ghost" onPress={this.searchCarNumber}>搜索</Button>
            </View>

        )
    }


    private searchCarNumber = async () => {
        if (isEmpty(this.state.searchText)) {
            return
        }
        else {

            const rj: RestfulJson = await getService(searchParkByCarNumberUrl(this.state.searchText)) as any
            const park: Park = rj.data
            this.setState({ searchResult: park })

        }
    }


    private delayParkTime = async () => {
        // const d = new Date()
        // d.setTime(d.getTime() + Number(this.state.delayTime) * 60 * 1000)
        // this.setState({ leaveTime: toDate(d) })

        const rj = await postService(extendParkUrl(this.parkId, this.state.delayTime), null) as RestfulJson

        const p: Park = rj.data

        this.setState({ leaveTime: toDate(new Date(p.leaveTime)) })

    }

    park = async () => {
        const c = this.currentPosition
        const { lng, lat } = gcj2wgs(c.longitude, c.latitude)
        const data: Park = {
            uid: UserAccount.getUid(), carNumber: this.state.carNumber, carPhone: this.state.phone,
            location: { coordinates: [lng, lat] }, gcjLocation: [c.longitude, c.latitude]
        }
        const res = await postService(parkUrl(this.state.stayTime), data) as RestfulJson

        // console.warn(`res:${JSON.stringify(res)}`)
        // EventRegister.emit(parkingEvent, 1)
        const p: Park = res.data
        this.parkId = p.id
        const d = new Date(p.leaveTime)
        // d.setTime(d.getTime() + Number(this.state.stayTime) * 60 * 1000)
        this.setState({ status: 1, btnText: '开车', leaveTime: toDate(d), delayTime: null })
    }

    drive = async () => {
        await deleteService(driveUrl(this.parkId, UserAccount.getUid()), null)
        // EventRegister.emit(parkingEvent, 0)
        this.setState({ status: 0, btnText: '停车', leaveTime: '', stayTime: null, delayTime: null })
    }


    private action = () => {
        if (this.state.status == 0) {
            this.park()
        }
        else if (this.state.status == 1) {
            this.drive()
        }
    }


    private _onDidMoveByUser = (e) => {
        let { longitude, latitude, } = e.nativeEvent.data.centerCoordinate
        console.warn(longitude, "=", latitude)
    }

    private _onSingleTappedAtCoordinate = (e) => {
        let { longitude, latitude, } = e.nativeEvent.data.Coordinate
        console.warn(longitude, "=", latitude)
    }

    private onMapPressed = (e) => {
        // let { longitude, latitude, } = e.nativeEvent


        // Geolocation.getReGeoCode({latitude,longitude},(result)=>{

        // });

    }





    private searchPark = async (longitude, latitude) => {
        const { lng, lat } = gcj2wgs(longitude, latitude)

        const rj: RestfulJson = await getService(matchShareParkPointUrl(lng, lat, 100)) as any //todo:补充uas

        console.warn(`matchShareParkPoint:${JSON.stringify(rj)}`)


        const uas: UserAccount[] = rj.data.uas
        const shareParks: any[] = rj.data.sharePark || []
        // const OffStreetPark : any[] = rj.data.offStreet
        // console.warn(JSON.stringify(shareParks))
        if (shareParks) {
            shareParks.forEach((element: ParkItem) => {
                const ua = uas.find(u => u.id == element.uid)
                element.publisher = ua;
            });

            const temp = shareParks //.filter((s: ParkItem) => s.uid != UserAccount.getUid())


            this.setState(
                {
                    nearParks: temp,
                }
            )
            // console.warn(JSON.stringify(shareParks))
        }
    }


    public async componentWillMount() {
        // if (Platform.OS == "android") {
        //     await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        // }

        await init();

        Geolocation.getCurrentPosition(({ coords }) => {
            const { longitude, latitude } = coords
            this.currentPosition = { longitude, latitude }
            // this.setState({ initLongitude: longitude, initLatitude: latitude })
            this.searchPark(longitude, latitude)
        });

        this.props.navigation.setParams({ "onSearchPressed": this.onSearchPressed })
    }

    public async componentDidMount() {

        const rj = await getService(parkGetUrl(UserAccount.getUid())) as RestfulJson



        const p: Park = rj.data
        this.parkId = p ? p.id : null
        setTimeout(() => {
            this.setState({
                status: this.parkId ? 1 : 0, btnText: this.parkId ? "开车" : "停车", carNumber: p ? p.carNumber : "", phone: p ? p.carPhone : "",
                leaveTime: toDate(new Date(p ? p.leaveTime : null))
            },

                () => {
                    // this.refs.map.setMarkers({
                    //     centerCoordinate: {
                    //         latitude: 22.529321,
                    //         longitude: 113.978006,
                    //     },

                    //     zoomLevel: 18,
                    // })
                })
        }, 100)
    }

    private renderMapview() {

        const props = Platform.select({
            ios: {},
            android: { hasScrollviewParent: true }
        })

        if (!this.state.initLongitude) {
            return null
        }

        return (
            <Amap style={StyleSheet.absoluteFill}
                onlyOneMarker={true}
                addMarkerOnTap={true}
                showsZoomControls={true}
                showsCompass={true}
                zoomLevel={18}
                coordinate={{
                    latitude: this.state.initLatitude,//22.536853,
                    longitude: this.state.initLongitude//114.057108
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
                        latitude: this.state.initLatitude,//22.536853,
                        longitude: this.state.initLongitude//114.057108
                    }}
                />
            </Amap>
        )
    }


    // private renderSubTitle = () => {
    //     return (
    //         <Text style={{ marginVertical: 10 }} appearance="hint" category="p1">附近有很多小吃</Text>
    //     )
    // }


    // private renderItemTitle = () => {
    //     return (
    //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingTop: 5 }}>
    //             <View style={{ flexDirection: 'row' }}>
    //                 <Text category="c2">东北人都是活雷锋</Text>
    //                 <LicensePlate category="c2" carNumber="粤B·AAAAA" />
    //             </View>
    //             <View style={{ flexDirection: 'row' }}>
    //                 <Text category="c2" appearance="hint">{"5分钟前 2车位 免费"}</Text>
    //             </View>
    //         </View>
    //     )
    // }


    private renderSubTitle = (info: ParkItem) => {
        return (
            <Text style={{ marginVertical: 10 }} appearance="hint" category="p1">{info.streetName}</Text>
        )
    }

    private renderItemTitle = (info: ParkItem) => {

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingTop: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text category="c2">{info.publisher.nickname}</Text>
                    {
                        info.publisher.carNumber ? <LicensePlate style={{ marginLeft: 5 }} category="c2" carNumber={info.publisher.carNumber} />
                            : null
                    }

                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text category="c2" appearance="hint">
                        {`${info.duration}分钟前 ${info.parkNumber}车位 ${info.forFree ? "免费" : "收费"} ${(info.distance * 1000).toFixed(0)}米`}
                    </Text>
                </View>
            </View>
        )
    }


    private renderParkItems = () => {
        const { nearParks } = this.state
        if (!nearParks) {
            return null
        }
        return (
            nearParks.map((p, index) => {
                return (
                    <ContentBox key={index.toString()} style={[{ flex: 1, marginTop: 5, borderColor: 'lightgrey', borderRadius: 5, borderWidth: 1 }]}
                        customTitleBox={() => this.renderItemTitle(p)} subTitle={() => this.renderSubTitle(p)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            {/* <Button size="small" onPress={() => console.warn("go go go")}>打赏</Button> */}
                            <Button size="small" onPress={() => this.showDialog(p.uid, p.id)}>感谢</Button>
                        </View>
                    </ContentBox>
                )
            })
        )


    }


    private thank = async () => {

        const param: ThankDTO = { parkId: this.toThankParkId, senderName: UserAccount.instance.nickname, senderUid: UserAccount.getUid(), uid: this.toThankUid, thankText: isEmpty(this.state.thankText) ? '多亏你提供的车位！' : this.state.thankText }
        const rj: RestfulJson = await postService(thankForParkUrl(), param) as any
        console.warn(JSON.stringify(rj))
        this.setState({ dialogVisible: false, thankText: '' },()=>{
            this.toast.show("赠人玫瑰，手留余香",DURATION.LENGTH_LONG)
        })

        // showMessage({
        //     message: "赠人玫瑰，手留余香",
        //     position: 'center',
        //     type: 'info'
        // })
    }

    private toThankUid = null
    private toThankParkId = null

    private showDialog = async (uid, parkId) => {

        const flag = await hasThanked(parkId)

        if (flag == true) {
            this.toast.show("一次就够了",DURATION.LENGTH_LONG)
            // showMessage({
            //     message: "一次就够了",
            //     position: "center",
            //     type: 'warning'
            // })

            return;
        }

        this.toThankParkId = parkId
        this.toThankUid = uid
        this.setState({ dialogVisible: true })
    }



    private renderPopup = () => {
        const { dialogVisible, thankText } = this.state
        return (
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>感谢留言</Dialog.Title>
                <Dialog.Input placeholder='感谢你的热心帮助！' value={thankText}
                    onChangeText={(txt) => { this.setState({ thankText: txt }) }} />
                <Dialog.Button label="取消" onPress={() => { this.setState({ dialogVisible: false }) }} />
                <Dialog.Button label="发送" onPress={this.thank} />
            </Dialog.Container>
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
                                    latitude: this.state.initLatitude,//22.536853,
                                    longitude: this.state.initLongitude//114.057108
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
                                        latitude: this.state.initLatitude,//22.536853,
                                        longitude: this.state.initLongitude//114.057108
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
        const { searchResult } = this.state

        // return (
        //     <ScrollableAvoidKeyboard style={themedStyle.container}>
        //         {this.renderSearchBar()}



        //     </ScrollableAvoidKeyboard>
        // )

        return (



            <ScrollableAvoidKeyboard style={themedStyle.container} extraScrollHeight={this.keyboardOffset}>

                <Toast ref={elm => this.toast = elm} style = {{backgroundColor:COLOR.success}}/>

                {this.renderPopup()}
                {this.renderSearchBar()}

                {/* <View style={{ paddingHorizontal: 16 }}>
                    <CheckBox text="展示后车箱商品" style={{ marginVertical: 10 }} textStyle={{ fontSize: 16 }} checked={true} status="danger" />
                </View> */}
                {/* <View style={{ marginBottom: 20, height: 300 }}>
                    {this.renderMapview()}
                </View> */}

                {searchResult === undefined ? null
                    :
                    (searchResult === null ? <Text appearance="hint" style={{ textAlign: 'center' }}>无此车停车记录</Text>
                        : <View style={{ padding: 10, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                {/* <Text>{searchResult.carNumber}</Text> */}
                                <LicensePlate category="p1" carNumber={searchResult.carNumber} />
                            </View>
                            <Text style={{ marginBottom: 5 }}>{`预计开车时间：${searchResult.leaveTime}`}</Text>
                            <Button size="small">电话通知车主挪车</Button>
                        </View>)
                }


                <View style={{ borderRadius: 5, borderWidth: 1, borderColor: "lightgrey", paddingTop: 5, marginHorizontal: 5 }}>
                    <Text style={{ textAlign: 'center' }} appearance="hint" category="p1">我的停车</Text>
                    <FormRow title="车牌号">
                        <View style={styles.form}>
                            <Input style={{ width: '100%' }} value={this.state.carNumber} onChangeText={(val) => this.setState({ carNumber: val.toUpperCase() })} placeholder="填写车牌号" />
                        </View>
                    </FormRow>
                    <FormRow title="挪车电话">
                        <View style={styles.form}>
                            <Input keyboardType='numeric' style={{ width: '100%' }} value={this.state.phone} onChangeText={(val) => this.setState({ phone: val })} placeholder="挪车电话" />
                        </View>
                    </FormRow>

                    {
                        this.state.status == 0 ?
                            <FormRow title="开车时间">
                                <View style={styles.form}>
                                    <Input keyboardType='number-pad' style={{ flex: 4 }} value={this.state.stayTime} onChangeText={(val) => this.setState({ stayTime: val })} placeholder="多少分钟后驶离" />
                                    <Text category="p2" style={{ flex: 1 }}>分钟后</Text>
                                </View>
                            </FormRow>
                            :
                            <React.Fragment>
                                <FormRow title="开车时间">
                                    <View style={styles.form}>
                                        <Text>{this.state.leaveTime}</Text>
                                    </View>
                                </FormRow>

                                <FormRow title="更改时间">
                                    <View style={styles.form}>
                                        <Input keyboardType='number-pad' style={{ flex: 4 }} value={this.state.delayTime} onChangeText={(val) => this.setState({ delayTime: val })} placeholder="多少分钟后驶离" />
                                        <Text style={{ flex: 2 }}>分钟后</Text>
                                        <TouchableOpacity onPress={this.delayParkTime} style={{
                                            flex: 1, paddingHorizontal: 3,
                                            backgroundColor: getThemeValue("color-warning-default", themes["App Theme"]), borderRadius: 4
                                        }}>
                                            <Text style={{ color: 'white', textAlign: 'center' }}>更改</Text>
                                        </TouchableOpacity>
                                    </View>
                                </FormRow>
                            </React.Fragment>

                    }

                    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        <View style={{ marginTop: 10 }}>
                            <Button onPress={this.action}>{this.state.btnText}</Button>
                            <Text category="p1" appearance="hint" >只有设置成停车状态，其他人才能通过车牌号联系你</Text>
                        </View>

                    </View>

                    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        {
                            (this.state.nearParks && this.state.nearParks.length > 0) ?
                                <Text category="s2" appearance="hint" style={{ marginVertical: 5 }}>
                                    意思一下，鼓励刚才给你提供车位信息的热心人吧
                                </Text>
                                : null
                        }
                        {this.renderParkItems()}
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


export const ParkingPage = withStyles(Parking, (theme: ThemeType) => ({
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