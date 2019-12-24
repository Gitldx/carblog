import React from 'react';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, CheckBox, Radio, Tooltip, } from 'react-native-ui-kitten';
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
import { SearchPlaceholder, FormRow } from '@src/components';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { parkUrl, getService, shareParkUrl, getNearestPointUrl, rj, countRoadChatUrl, rrnol } from '@src/core/uitls/httpService';
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
import { Toast, DURATION, COLOR } from '@src/components'
import { getSevertimeDiff } from '@src/core/uitls/readParameter';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { networkConnected } from '@src/core/uitls/netStatus';




type Props = ThemedComponentProps & NavigationScreenProps

type State = {
    mapHeight: number,
    mapShow: boolean,
    initLatitude: number,
    initLongitude: number,
    selectedRoad: string,
    chatCounts: number
    // limitRegion: any
}

// const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

class SelectRoad extends React.Component<Props, State> {

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

            title: '选择道路'
        }
    }


    private selectedPoint: { lat: number, lng: number, citycode: number }
    private selectCallback: (citycode, road, longitude, latitude) => void


    private keyboardOffset: number = Platform.select({
        ios: 40,
        android: 30,
    });


    public state: State = {

        mapHeight: 0,
        mapShow: false,
        initLatitude: null,
        initLongitude: null,
        selectedRoad: '',
        chatCounts: 0

        // limitRegion: null
    }


    private go = () => {
        const { lng, lat, citycode } = this.selectedPoint
        this.selectCallback(citycode, this.state.selectedRoad, lng, lat)
        setTimeout(() => {
            this.props.navigation.goBack(KEY_NAVIGATION_BACK)
        }, 0);
    }




    private onMapPressed = async (e) => {
        let { longitude, latitude, } = e.nativeEvent



        Geolocation.getReGeoCode({ latitude, longitude }, (result) => {
            this.selectedPoint = { lat: latitude, lng: longitude, citycode: result.citycode };
            this.setState({ selectedRoad: result.road }, () => {
                this.getCounts()
            })
        });

    }



    private getCounts = async () => {
        const rr = await getService(countRoadChatUrl(this.selectedPoint.citycode, this.state.selectedRoad))
        if (rrnol(rr)) {
            return
        }
        // console.warn(JSON.stringify(rr))
        const count = rj(rr).data
        this.setState({ chatCounts: count })
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



            Geolocation.getReGeoCode({
                latitude: latitude,
                longitude: longitude,
            }, (result) => {
                this.selectedPoint = { lat: latitude, lng: longitude, citycode: result.citycode }
                this.setState({ selectedRoad: result.road })
            });

            setTimeout(() => {
                this.setState({ mapShow: true, initLongitude: longitude, initLatitude: latitude }, () => {
                    // setTimeout(() => this.setState({
                    //     limitRegion: {
                    //         latitude: this.state.initLatitude,
                    //         longitude: this.state.initLongitude, latitudeDelta: 0.004, longitudeDelta: 0.004
                    //     }
                    // }), 1000)
                })
            }, 500);


        });

    }



    public componentDidMount() {

        this.selectCallback = this.props.navigation.getParam("selectCallback")

    }

    public renderMapview() {

        const props: any = Platform.select({
            ios: {},
            android: { hasScrollviewParent: true }
        })

        // if (this.state.limitRegion) {
        //     props.limitRegion = this.state.limitRegion
        // }



        return (
            <Amap ref="mapview" style={StyleSheet.absoluteFill}
                onlyOneMarker={true}
                addMarkerOnTap={true}
                showsZoomControls={true}
                showsCompass={true}
                // minZoomLevel={16}
                zoomLevel={16}
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
                    // active={true}
                    image="purplepin"
                    infoWindowDisabled={true}
                    // title="定位不准？手点地图"
                    // onPress={this._onMarkerPress}
                    coordinate={{
                        latitude: this.state.initLatitude,
                        longitude: this.state.initLongitude
                    }}
                />
            </Amap>
        )
    }



    public render(): React.ReactNode {
        const { themedStyle } = this.props

        return (



            <ScrollableAvoidKeyboard style={themedStyle.container} extraScrollHeight={this.keyboardOffset}>
                {/* {this.renderSearchBar()} */}


                <View style={{ paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                        <Text appearance="hint" category="p2">选择道路</Text>

                    </View>
                </View>
                <View style={{ marginBottom: 20, height: 300 }}>
                    {this.state.mapShow ? this.renderMapview() : null}
                    {/* <View style={{backgroundColor:'yellow',width:300,height:28,position:'absolute',zIndex:9999,bottom:0,left:0}}></View> */}
                </View>
                <View style={{ paddingHorizontal: 16}}>
                    {
                        this.state.selectedRoad ?
                            <Text appearance="hint">{this.state.selectedRoad}</Text>
                            : null
                    }


                    <Text appearance="hint" style={{ marginTop: 10 }}>
                        {`发言总数：${this.state.chatCounts}`}
                    </Text>

                </View>
                <View>

                    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        <View style={{ marginTop: 10 }}>
                            <Button onPress={this.go}>切换道路</Button>
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


export const SelectRoadPage = withStyles(SelectRoad, (theme: ThemeType) => ({
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