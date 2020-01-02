import React from 'react';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, CheckBox, Radio, Tooltip, List, ListItem, ButtonGroup, } from 'react-native-ui-kitten';

import { PageView } from '../../pageView';

import Amap from '@src/components/amap'
import { init } from "@src/components/amap/location";
import { ParkItem } from './type';
import ActionSheet from 'react-native-actionsheet'
import MapLinking from '@src/core/uitls/mapLinking';
import { simpleAlert } from '@src/core/uitls/alertActions';
import { LicensePlate } from '@src/components';
import { isEmpty } from '@src/core/uitls/common';




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
    mapType: "standard" | "satellite"
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
        currentLatitude: null,
        currentLongitude: null,
        // selectedAddress: '',
        // tooltipVisible: false
        mapType: 'standard'
    }


    private parkId: string

    private ActionSheet: ActionSheet

    private openActionSheet = () => {
        this.ActionSheet.show()
    }


    private trylinkAMap = async () => {
        const info = this.info

        const canopen = await MapLinking.isInstallAmap()
        console.warn(`canopen:${canopen}`)
        if (!canopen) {
            simpleAlert("温馨提示", "您的手机可能没有安装高德地图app")
            return
        }

        const result = await MapLinking.openAmap({ lat: info.gcjLocation[1], lng: info.gcjLocation[0] })
        console.warn(result)
        // const result = await MapLinking.openBaiDuMap({ lat: item.gcjLocation[1], lng: item.gcjLocation[0] })
        // console.warn(result)
    }


    private trylinkBaiduMap = async () => {
        const info = this.info

        const canopen = await MapLinking.isInstallBaiDuMap()

        if (!canopen) {
            simpleAlert("温馨提示", "您的手机可能没有安装百度地图app")
            return
        }

        const result = await MapLinking.openBaiDuMap({ lat: info.gcjLocation[1], lng: info.gcjLocation[0] })
        // console.warn(result)
        // const result = await MapLinking.openBaiDuMap({ lat: item.gcjLocation[1], lng: item.gcjLocation[0] })
        // console.warn(result)
    }


    private trylinkQQMap = async () => {
        const info = this.info

        const canopen = await MapLinking.isInstallQQMap()

        if (!canopen) {
            simpleAlert("温馨提示", "您的手机可能没有安装腾讯地图app")
            return
        }

        const result = await MapLinking.openQQMap(
            {
                slat: this.state.currentLatitude, slng: this.state.currentLongitude,
                dlat: info.gcjLocation[1], dlng: info.gcjLocation[0]
            })
        // console.warn(result)
        // const result = await MapLinking.openBaiDuMap({ lat: item.gcjLocation[1], lng: item.gcjLocation[0] })
        // console.warn(result)
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

    private info: ParkItem

    public componentWillMount() {

        init();

        this.info = this.props.navigation.getParam("info")
    }

    public componentDidMount() {


        setTimeout(() => {
            this.setState({
                mapShow: true,
                currentLatitude: this.info.gcjLocation[1],
                currentLongitude: this.info.gcjLocation[0]
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
                mapType={this.state.mapType}
                coordinate={{
                    latitude: this.state.currentLatitude,
                    longitude: this.state.currentLongitude
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

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'使用以下地图导航'}
                    options={['高德地图', '百度地图', '腾讯地图', '取消']}
                    cancelButtonIndex={3}
                    // destructiveButtonIndex={1}
                    onPress={this.tryOpenMap}
                />

                <View style={{ marginBottom: 20, height: 400 }}>
                    {this.state.mapShow ? this.renderMapview() : null}
                    <View style={{ width: 300, height: 35, position: 'absolute', zIndex: 9999, bottom: 0, left: 0 }}>
                        <ButtonGroup size='small'>
                            <Button onPress={() => this.setState({ mapType: 'satellite' })}>卫星地图</Button>
                            <Button onPress={() => this.setState({ mapType: 'standard' })}>标准地图</Button>
                        </ButtonGroup>
                    </View>               
                </View>

                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.info.publisher && <Text style={{ marginLeft: 10 }}>{this.info.publisher.nickname}</Text>}
                        {
                            (this.info.publisher && !isEmpty(this.info.publisher.carNumber)) ? <LicensePlate style={{ marginLeft: 5 }} category="c2" carNumber={this.info.publisher.carNumber} />
                                : null
                        }

                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                            <Text category="c2" appearance="hint">
                                {
                                    this.info.publisher ?
                                        `${this.info.duration}分钟前 ${this.info.parkNumber}车位 ${this.info.forFree ? "免费" : "收费"} ${(this.info.distance * 1000).toFixed(0)}米`
                                        :
                                        `${this.info.forFree ? "免费" : "收费"} ${(this.info.distance * 1000).toFixed(0)}米`
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={{ paddingLeft: 10 }}>
                        <Text>
                            {this.info.streetName}
                        </Text>
                        <Text>
                            {this.info.parkName}
                        </Text>
                        <Text>
                            {this.info.note}
                        </Text>
                    </View>



                    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        <View style={{ marginTop: 10 }}>
                            <Button size="small" onPress={this.openActionSheet}>导航至此处</Button>
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