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
import { postService, parkUrl, getService, parkGetUrl, RestfulJson, driveUrl, deleteService, extendParkUrl } from '@src/core/uitls/httpService';
import { toDate, isEmpty } from '@src/core/uitls/common';
import Amap from '@src/components/amap'
import { PermissionsAndroid } from "react-native";
import { init, Geolocation } from "@src/components/amap/location";
import { Park } from '@src/core/model';
import { UserAccount } from '@src/core/userAccount/userAccount';




type Props = ThemedComponentProps & NavigationScreenProps

type State = {
    selectedItem: number
    // forfree: boolean,
    // parkType: number,//0:路边停车场，1:路外停车场
    // parkName: string,
    // parkNumber: string,
    // info: string,
    // mapHeight: number,
    mapShow: boolean,
    currentLatitude: number,
    currentLongitude: number,
    // selectedAddress: string,
    // tooltipVisible: boolean
}

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

class ParkDetail extends React.Component<Props, State> {


    static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
        return {

            title: '车位信息'
        }
    }


    public state: State = {
        selectedItem: 0,
        // forfree: false,
        // parkType: 0,
        // parkName: "",
        // parkNumber: "1",
        // info: "",
        // mapHeight: 0,
        mapShow: false,
        currentLatitude: 22.536853,
        currentLongitude: 114.057108
        // selectedAddress: '',
        // tooltipVisible: false

    }


    private parkId: string



    private onMapPressed = (e) => {
        // let { longitude, latitude, } = e.nativeEvent


        // Geolocation.getReGeoCode({ latitude, longitude }, (result) => {
        //     this.setState({ selectedAddress: result.address })
        // });

    }


    private renderSubTitle = () => {
        return (
            <Text>附近有很多小吃</Text>
        )
    }

    private onItemPressed = (info: ListRenderItemInfo<any>) => {
        (this.refs.mapview as any).animateTo({ coordinate: { latitude: 22.538853, longitude: 114.057108 } })
        this.setState({ selectedItem: info.index, currentLatitude: 22.538853, currentLongitude: 114.057108 })
    }

    private renderItem = (info: ListRenderItemInfo<any>) => {
        const { selectedItem } = this.state
        const style = info.index == selectedItem ? { borderWidth: 1, borderRadius: 5, borderColor: getThemeValue("color-warning-default", themes['App Theme']) } : null
        return (
            <ListItem style={{ flex: 1 }} onPress={() => this.onItemPressed(info)}>
                <ContentBox style={[{ flex: 1, marginTop: 5 }, style]}
                    titleLabel="福田路xx停车场" titleInfo="5分钟前 2车位 免费 200米" subTitle={this.renderSubTitle}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Button size="small" onPress={() => console.warn("go go go")}>更多详情</Button>
                        <Button size="small" onPress={() => console.warn("go go go")}>导航至此处</Button>
                    </View>
                </ContentBox>
            </ListItem>
        )
    }

    public componentWillMount() {
        // if (Platform.OS == "android") {
        //     await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        // }

        init();


    }

    public async componentDidMount() {


        setTimeout(() => {
            this.setState({
                mapShow: true
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
        }, 500)
    }

    public renderMapview() {

        const props = Platform.select({
            ios: {},
            android: { hasScrollviewParent: true }
        })

        return (
            <Amap ref="mapview" style={StyleSheet.absoluteFill}
                onlyOneMarker={false}
                addMarkerOnTap={false}
                showsZoomControls={true}
                showsCompass={true}
                zoomLevel={18}
                coordinate={{
                    latitude: 22.536853,
                    longitude: 114.057108
                }}

                {...props}
                locationEnabled
                // onLocation={({ nativeEvent }) =>
                //     console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
                onPress={this.onMapPressed}
            >
                <Amap.Marker color="red"
                    // active={true}
                    // image="purplepin"
                    // title="定位不准？手点地图"
                    // onPress={this._onMarkerPress}
                    coordinate={{
                        latitude: this.state.currentLatitude,//22.536853,
                        longitude: this.state.currentLongitude//114.057108
                    }}
                />
            </Amap>
        )
    }



    public render(): React.ReactNode {
        const { themedStyle } = this.props

        return (
            <PageView style={themedStyle.container}>



                <View style={{ marginBottom: 20, height: 400 }}>
                    {this.state.mapShow ? this.renderMapview() : null}
                    {/* <View style={{backgroundColor:'yellow',width:300,height:28,position:'absolute',zIndex:9999,bottom:0,left:0}}></View> */}
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>xx热心人</Text>
                        <LicensePlate carNumber="粤B·A8J67"/>
                        <Text>{"  2分钟前  3车位  免费  300米"}</Text>
                    </View>
                    <Text>
                        福田区XXX路星河广场
                    </Text>
                    <Text>
                        大中华国际广场停车场
                    </Text>
                    <Text>
                        消费免车费
                    </Text>



                    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        <View style={{ marginTop: 10 }}>
                        <Button size="small" onPress={() => console.warn("go go go")}>导航至此处</Button>
                        </View>

                    </View>





                </View>
            </PageView>

        );
    }


}





export const ParkDetailPage = withStyles(ParkDetail, (theme: ThemeType) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
    }
}));