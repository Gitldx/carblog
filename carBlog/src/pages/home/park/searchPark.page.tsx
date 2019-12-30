import React from 'react';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, CheckBox, Radio, Tooltip, List, ListItem, } from 'react-native-ui-kitten';
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
import { getService, searchNearParkUrl, rrnol, rj } from '@src/core/uitls/httpService';
import { toDate, isEmpty, gcj2wgs } from '@src/core/uitls/common';
import Amap from '@src/components/amap'
import { PermissionsAndroid } from "react-native";
import { init, Geolocation } from "@src/components/amap/location";
import { Park } from '@src/core/model';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { SharePark, OffStreetPark } from '@src/core/model/park';
import { ParkItem } from './type';
import MapLinking from '@src/core/uitls/mapLinking';
import ActionSheet from 'react-native-actionsheet'
import { simpleAlert } from '@src/core/uitls/alertActions';
import { calculateSearchScore } from './parkUtils';
import { showMessage } from 'react-native-flash-message';
import { Toast, DURATION, COLOR } from '@src/components'
import { onlineAccountState } from '@src/core/userAccount/functions';
import Spinner from 'react-native-loading-spinner-overlay';
import { loginhint1 } from '@src/core/uitls/constants';



type Props = ThemedComponentProps & NavigationScreenProps



type State = {
    selectedItem: number
    mapShow: boolean,
    initLatitude: number,
    initLongitude: number,
    currentLatitude: number,
    currentLongitude: number,
    nearParks: ParkItem[],
    selectedLatitude: number,
    selectedLongitude: number,
    /**
    * 0:默认状态，1:正在加载，2:已到末尾
    */
    loading: number,
    spinner:boolean
}

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

class SearchPark extends React.Component<Props, State> {

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


        // const rightControls = <Button appearance="ghost">求车位</Button>

        return {
            // rightControls,
            title: '附近车位'
        }
    }



    private currentPage: number = 0

    private toast: Toast
    private toast2: Toast

    public state: State = {
        selectedItem: 0,
        // mapHeight: 0,
        mapShow: false,
        initLatitude: null,
        initLongitude: null,
        currentLatitude: null,//22.536853,
        currentLongitude: null,//114.057108
        nearParks: [],
        selectedLatitude: null,
        selectedLongitude: null,
        loading: 0,
        spinner : false

    }


    private parkId: string


    private ActionSheet: ActionSheet


    private _onDidMoveByUser = (e) => {
        let { longitude, latitude, } = e.nativeEvent.data.centerCoordinate
        console.warn(longitude, "=", latitude)

    }

    private _onSingleTappedAtCoordinate = (e) => {
        let { longitude, latitude, } = e.nativeEvent.data.Coordinate
        console.warn(longitude, "=", latitude)
    }


    private onMapPressed = (e) => {
        let { longitude, latitude, } = e.nativeEvent

        this.setState({ selectedLatitude: latitude, selectedLongitude: longitude })
        this.searchPark(longitude, latitude)
        // Geolocation.getReGeoCode({ latitude, longitude }, (result) => {
        //     this.setState({ selectedAddress: result.address })
        // });

    }


    private gotoDetail = (info: ListRenderItemInfo<ParkItem>) => {
        this.props.navigation.navigate("ParkDetail", { info: info.item })
    }


    private renderSubTitle = (info: ListRenderItemInfo<ParkItem>) => {
        return (
            <Text style={{ marginVertical: 10 }} appearance="hint" category="p1">{info.item.streetName}</Text>
        )
    }

    private renderItemTitle = (info: ListRenderItemInfo<ParkItem>) => {
        const { item } = info
        return (
            item.parkName ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingTop: 5 }}>
                    <Text category="c2">{item.parkName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text category="c2" appearance="hint">
                            {`${item.forFree ? "免费" : "收费"} ${(item.distance * 1000).toFixed(0)}米`}
                        </Text>
                    </View>
                </View>
                :
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5, paddingTop: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text category="c2">{item.publisher.nickname}</Text>
                        {
                            !isEmpty(item.publisher.carNumber) ? <LicensePlate style={{ marginLeft: 5 }} category="c2" carNumber={item.publisher.carNumber} />
                                : null
                        }

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text category="c2" appearance="hint">
                            {`${item.duration}分钟前 ${item.parkNumber}车位 ${item.forFree ? "免费" : "收费"} ${(item.distance * 1000).toFixed(0)}米`}
                        </Text>
                    </View>
                </View>
        )
    }

    private onItemPressed = (info: ListRenderItemInfo<ParkItem>) => {
        const { item } = info
        const lng = item.gcjLocation[0]
        const lat = item.gcjLocation[1]
        const map = this.refs.mapview as any
        map.animateTo({ coordinate: { latitude: lat, longitude: lng } })
        this.setState({ selectedItem: info.index, currentLatitude: lat, currentLongitude: lng })
    }


    private trylinkAMap = async () => {
        const { item } = this.toNavItem

        const canopen = await MapLinking.isInstallAmap()
        console.warn(`canopen:${canopen}`)
        if (!canopen) {
            simpleAlert("温馨提示", "您的手机可能没有安装高德地图app")
            return
        }

        const result = await MapLinking.openAmap({ lat: item.gcjLocation[1], lng: item.gcjLocation[0] })
        console.warn(result)
        // const result = await MapLinking.openBaiDuMap({ lat: item.gcjLocation[1], lng: item.gcjLocation[0] })
        // console.warn(result)
    }


    private trylinkBaiduMap = async () => {
        const { item } = this.toNavItem

        const canopen = await MapLinking.isInstallBaiDuMap()

        if (!canopen) {
            simpleAlert("温馨提示", "您的手机可能没有安装百度地图app")
            return
        }

        const result = await MapLinking.openBaiDuMap({ lat: item.gcjLocation[1], lng: item.gcjLocation[0] })
        // console.warn(result)
        // const result = await MapLinking.openBaiDuMap({ lat: item.gcjLocation[1], lng: item.gcjLocation[0] })
        // console.warn(result)
    }


    private trylinkQQMap = async () => {
        const { item } = this.toNavItem

        const canopen = await MapLinking.isInstallQQMap()

        if (!canopen) {
            simpleAlert("温馨提示", "您的手机可能没有安装腾讯地图app")
            return
        }

        const result = await MapLinking.openQQMap(
            {
                slat: this.state.initLatitude, slng: this.state.initLongitude,
                dlat: item.gcjLocation[1], dlng: item.gcjLocation[0]
            })
        // console.warn(result)
        // const result = await MapLinking.openBaiDuMap({ lat: item.gcjLocation[1], lng: item.gcjLocation[0] })
        // console.warn(result)
    }


    private toNavItem: ListRenderItemInfo<ParkItem>
    private openActionSheet = (info: ListRenderItemInfo<ParkItem>) => {
        this.toNavItem = info
        this.ActionSheet.show()
    }

    private tryOpenMap = (index: number) => {

        switch (index) {
            case 0:
                this.trylinkAMap()
                break;
            case 1:
                this.trylinkBaiduMap()
                break;
            case 2:
                this.trylinkQQMap()
                break;
        }

    }

    private pressMore = () => {
        this.setState({ loading: 1 })

        this.getMore()

    }

    private renderFooter = (): React.ReactElement => {

        const { loading } = this.state

        if (loading == 2) {
            return (
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ textAlign: 'center' }} appearance="hint">到底了</Text>
                </View>
            )
        }

        return (
            <TouchableOpacity style={{ marginVertical: 10 }} onPress={this.pressMore}>
                <Text style={{ textAlign: 'center' }} appearance="hint">{loading == 1 ? '正在加载...' : '点击加载更多'}</Text>
            </TouchableOpacity>
        )
    }

    private renderItem = (info: ListRenderItemInfo<ParkItem>) => {
        const { selectedItem } = this.state
        const style = info.index == selectedItem ? { borderWidth: 1, borderRadius: 5, borderColor: getThemeValue("color-warning-default", themes['App Theme']) } : null
        return (
            <ListItem style={{ flex: 1 }} onPress={() => this.onItemPressed(info)}>
                <ContentBox style={[{ flex: 1, marginTop: 5 }, style]} customTitleBox={() => this.renderItemTitle(info)}
                >
                    {this.renderSubTitle(info)}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Button size="small" onPress={() => this.gotoDetail(info)}>更多详情</Button>
                        <Button size="small" onPress={() => this.openActionSheet(info)}>导航至此处</Button>
                    </View>
                </ContentBox>
            </ListItem>
        )
    }


    private netRequest = async (wgsLongitude, wgsLatitude) => {
        // if(true){
        //     this.toast.show(`您的车位币余额${-0.4}已经小于零，要想办法多多生产车位币哦`, 5000)
        //     this.setState({spinner:false})
        // }
        // return;
        const role = UserAccount.instance.role
        const rr = await getService(searchNearParkUrl(wgsLongitude, wgsLatitude, this.currentPage, UserAccount.getUid(),role))
        
        if(rrnol(rr)){
            this.currentPage--
            return { shareParks:[], currentLatitude:0, currentLongitude:0, selectedItem:0, loading:0 }
        }
        const myMoney : UserAccount = rj(rr).data.ua//注意非车主此处为空
        const uas: UserAccount[] = rj(rr).data.uas
        const shareParks: any[] = rj(rr).data.park || []
        // console.warn(`shareparks:${JSON.stringify(shareParks)}`)
        const OffStreetPark: any[] = rj(rr).data.offStreet || []

        shareParks.forEach((element: ParkItem) => {
            const ua = uas.find(u => u.id == element.uid)
            element.publisher = ua;
        });

        const s = onlineAccountState()

        if (s != 1) {
            showMessage({
                message: "提示",
                description: loginhint1,
                position: 'center',
                type: 'info',
                icon: "info",
                floating: true,
                duration: 4000,
                onPress:()=>{setTimeout(() => {
                    this.props.navigation.navigate("MyScore")
                }, 0);}
            })
        }
        else {
            const score = await calculateSearchScore(shareParks)

            if (score > 0) {
                if(myMoney && myMoney.parkMoney < 0){
                    this.toast2.show(`您的车位币余额${myMoney.parkMoney}已经小于零，要想办法多多生产车位币哦`, 5000)
                }
                else{
                    this.toast.show("- " + (score * 0.1), DURATION.LENGTH_SHORT)
                }
                
            }
        }



        if (OffStreetPark.length > 0) {
            OffStreetPark.forEach((osp: OffStreetPark) => {
                if (!shareParks.some((sp: SharePark) => sp.offStreetParkId == osp.id)) {
                    shareParks.push(osp)
                }
            })
        }


        let currentLatitude, currentLongitude = null
        let selectedItem = this.state.selectedItem
        if (shareParks.length > 0) {
            const first: SharePark = shareParks[0]
            currentLatitude = first.gcjLocation[1]
            currentLongitude = first.gcjLocation[0]
            selectedItem = this.state.nearParks.length
        }

        const loading = shareParks.length > 0 ? 0 : 2

        return { shareParks, currentLatitude, currentLongitude, selectedItem, loading }

    }


    private getMore = async () => {
        this.currentPage++;
        const { initLongitude, initLatitude, selectedLatitude, selectedLongitude } = this.state
        let _lat = initLatitude
        let _lng = initLongitude
        if (selectedLatitude != null) {
            _lat = selectedLatitude
            _lng = selectedLongitude
        }
        const { lng, lat } = gcj2wgs(_lng, _lat)
        const { shareParks, loading } = await this.netRequest(lng, lat)
        // const rj: RestfulJson = await getService(searchNearParkUrl(lng, lat, this.currentPage, UserAccount.getUid())) as any
        // const uas: UserAccount[] = rj.data.uas
        // const shareParks: any[] = rj.data.park || []
        // const OffStreetPark: any[] = rj.data.offStreet || []

        // shareParks.forEach((element: ParkItem) => {
        //     const ua = uas.find(u => u.id == element.uid)
        //     element.publisher = ua;
        // });

        // if (OffStreetPark.length > 0) {
        //     OffStreetPark.forEach((osp: OffStreetPark) => {
        //         if (!shareParks.some((sp: SharePark) => sp.offStreetParkId == osp.id)) {
        //             shareParks.push(osp)
        //         }
        //     })
        // }


        // let currentLatitude, currentLongitude = null
        // let selectedItem = this.state.selectedItem
        // if (shareParks.length > 0) {
        //     const first: SharePark = shareParks[0]
        //     currentLatitude = first.gcjLocation[1]
        //     currentLongitude = first.gcjLocation[0]
        //     selectedItem = this.state.nearParks.length
        // }

        // const loading = shareParks.length > 0 ? 0 : 2
        const temp = this.state.nearParks.concat(shareParks)

        this.setState(
            {
                nearParks: temp,
                loading
            }
        )
    }


    private searchPark = async (longitude, latitude) => {

        this.setState({spinner:true})

        const { lng, lat } = gcj2wgs(longitude, latitude)

        this.currentPage = 0

        const { shareParks, currentLongitude, currentLatitude, loading } = await this.netRequest(lng, lat)

        // const rj: RestfulJson = await getService(searchNearParkUrl(lng, lat, this.currentPage, UserAccount.getUid())) as any


        // const uas: UserAccount[] = rj.data.uas
        // const shareParks: any[] = rj.data.park || []
        // const OffStreetPark: any[] = rj.data.offStreet || []
        // if (shareParks) {
        //     shareParks.forEach((element: ParkItem) => {
        //         const ua = uas.find(u => u.id == element.uid)
        //         element.publisher = ua;
        //     });

        //     if (OffStreetPark.length > 0) {
        //         OffStreetPark.forEach((osp: OffStreetPark) => {
        //             if (!shareParks.some((sp: SharePark) => sp.offStreetParkId == osp.id)) {
        //                 shareParks.push(osp)
        //             }
        //         })
        //     }


        //     let currentLatitude, currentLongitude = null
        //     if (shareParks.length > 0) {
        //         const first: SharePark = shareParks[0]
        //         currentLatitude = first.gcjLocation[1]
        //         currentLongitude = first.gcjLocation[0]
        //     }


        this.setState(
            {
                selectedItem: 0, nearParks: shareParks,
                currentLatitude, currentLongitude, loading,
                spinner:false
            }
        )
        // console.warn(JSON.stringify(shareParks))
        // }
    }

    public async componentWillMount() {
        // if (Platform.OS == "android") {
        //     await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        // }

        await init();

        Geolocation.getCurrentPosition(async ({ coords }) => {
            const { latitude, longitude } = coords

            setTimeout(() => {
                this.setState({ mapShow: true, initLatitude: latitude, initLongitude: longitude })

                this.searchPark(longitude, latitude)
            }, 500);

            // const {lng,lat} = gcj2wgs(longitude,latitude)

            // const rj :RestfulJson = await getService(searchNearParkUrl(lng,lat,0,UserAccount.getUid())) as any

            // const uas : UserAccount[] = rj.data.uas
            // const shareParks = rj.data.park
            // if(shareParks.length>0){
            //     shareParks.forEach((element : ParkItem) => {
            //         const ua = uas.find(u=>u.id==element.uid)
            //         element.publisher = ua;
            //     });
            //     const first : SharePark = shareParks[0]
            //     this.setState({nearParks:shareParks,currentLatitude:first.gcjLocation[1],currentLongitude:first.gcjLocation[0]})
            //     // console.warn(JSON.stringify(shareParks))
            // }

        })


    }

    public async componentDidMount() {


        // setTimeout(() => {
        //     this.setState({
        //         mapShow: true
        //     },

        //         () => {
        //             // this.refs.map.setMarkers({
        //             //     centerCoordinate: {
        //             //         latitude: 22.529321,
        //             //         longitude: 113.978006,
        //             //     },

        //             //     zoomLevel: 18,
        //             // })
        //         })
        // }, 500)
    }

    public renderMapview() {

        const props = Platform.select({
            ios: {},
            android: { hasScrollviewParent: true }
        })

        const { initLongitude, initLatitude, currentLatitude, currentLongitude, selectedLongitude, selectedLatitude } = this.state

        return (

            <Amap ref="mapview" style={StyleSheet.absoluteFill}
                onlyOneMarker={false}
                addMarkerOnTap={false}
                showsZoomControls={true}
                showsCompass={true}
                zoomLevel={15}
                coordinate={{
                    latitude: initLatitude,//22.536853,
                    longitude: initLongitude//114.057108
                }}

                {...props}
                locationEnabled
                locationStyle={{
                    fillColor: "rgba(0,0,0,0)",
                    strokeColor: "rgba(0,0,0,0)"
                }}
                // onLocation={({ nativeEvent }) =>
                //     console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
                onPress={this.onMapPressed}
            >
                {
                    currentLatitude ?
                        <Amap.Marker color="red"

                            coordinate={{
                                latitude: currentLatitude,//22.536853,
                                longitude: currentLongitude//114.057108
                            }}
                        />
                        : null
                }
                {
                    selectedLatitude ?
                        <Amap.Marker color="green"

                            coordinate={{
                                latitude: selectedLatitude,
                                longitude: selectedLongitude
                            }}
                        />
                        : null
                }


            </Amap>


        )
    }



    public render(): React.ReactNode {
        const { themedStyle } = this.props

        return (
            <PageView style={themedStyle.container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'找车位...'}
                    textStyle={{ color: 'white' }}
                />
                <Toast ref={elm => this.toast = elm} opacity={0.8} style={{ backgroundColor: COLOR.warning }} />
                <Toast ref={elm => this.toast2 = elm} opacity={0.8} style={{ backgroundColor: COLOR.danger }} />
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'使用以下地图导航'}
                    options={['高德地图', '百度地图', '腾讯地图', '取消']}
                    cancelButtonIndex={3}
                    // destructiveButtonIndex={1}
                    onPress={this.tryOpenMap}
                />



                <Text style={{marginLeft:10}}>点击你的目的地，搜索附近一公里停车位</Text>

                <View style={{ marginBottom: 20, height: 250 }}>
                    {this.state.mapShow ? this.renderMapview() : null}
                    {/* <View style={{backgroundColor:'yellow',width:300,height:28,position:'absolute',zIndex:9999,bottom:0,left:0}}></View> */}
                </View>

                <View style={{ flex: 1 }}>

                    <List style={{ flex: 1 }}
                        data={this.state.nearParks}
                        renderItem={this.renderItem}
                        ListFooterComponent={this.renderFooter}
                    />



                    {/* <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        <View style={{ marginTop: 10 }}>
                            <Button >发布</Button>
                            <Text style={{ textAlign: 'center', marginTop: 10 }} category="p1" appearance="hint" >分享快乐</Text>
                        </View>

                    </View> */}





                </View>
            </PageView>

        );
    }


}



const styles = StyleSheet.create({
    form: {
        flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    }
});


export const SearchParkPage = withStyles(SearchPark, (theme: ThemeType) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme['background-basic-color-1'],
    },
    button: { color: 'red' }
}));