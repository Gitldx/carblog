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
import { SearchPlaceholder, FormRow } from '@src/components';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { parkUrl, getService, shareParkUrl, getNearestPointUrl, rj, countRoadChatUrl, rrnol, getMetroLinesUrl, postService, commitReportUrl } from '@src/core/uitls/httpService';
import { toDate, isEmpty, gcj2wgs, timeDiffInSeconds, showNoAccountOnAlert, showNoNetworkAlert, showOngoingAlert } from '@src/core/uitls/common';
import Amap from '@src/components/amap'
import { PermissionsAndroid } from "react-native";
import { init, Geolocation, getDistance } from "@src/components/amap/location";
import { Park, globalFields } from '@src/core/model';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { OffStreetPark, SharePark as ShareParkModel } from '@src/core/model/park';
import { ParkItem } from './type';
import { simpleAlert } from '@src/core/uitls/alertActions';
import { NEARDEVIATION } from '@src/core/uitls/constants';
import { saveLastLocation, getLastLocation, LocationStorage, saveLastCity, LastMetroLine, getLastMetroLine, saveLastMetroLine, LastMetroCity, getLastMetroCity } from '@src/core/uitls/storage/locationStorage';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { Toast, DURATION, COLOR } from '@src/components'
import { getSevertimeDiff } from '@src/core/uitls/readParameter';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { networkConnected } from '@src/core/uitls/netStatus';
import { MetroLine } from '@src/core/model/metro.model';
import Dialog from 'react-native-dialog'
import debounce from '@src/core/uitls/debounce'


declare var global: globalFields

type Props = ThemedComponentProps & NavigationScreenProps

type State = {
    lines: MetroLine[],
    currentLineId: string,
    direction: 12 | 21,
    dialogVisible: boolean,
    reportText: string
}


class SelectMetrolLine extends React.Component<Props, State> {

    static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
        return {

            title: '选择地铁路线'
        }
    }


    private selectedPoint: { lat: number, lng: number, citycode: number }
    private selectCallback: (metroLine: MetroLine, direction: number) => void


    public state: State = {
        lines: [],
        currentLineId: null,
        direction: null,
        dialogVisible: false,
        reportText: ""
    }


    private go = () => {
        // const { lng, lat, citycode } = this.selectedPoint
        if (isEmpty(this.selectedLine)) {
            simpleAlert(null, "请选择地铁路线")
            return;
        }

        saveLastMetroLine(this.selectedLine)

        this.selectCallback(this.selectedLine, this.selectedLine.direction)
        setTimeout(() => {
            this.props.navigation.goBack(KEY_NAVIGATION_BACK)
        }, 0);
    }


    private goToCities = () => {
        this.props.navigation.navigate("SelectMetroCity", { selectCallback: this.selectCityCallback })
    }


    private selectCityCallback = async (city: LastMetroCity) => {
        const rr = await getService(getMetroLinesUrl(city.cityCode))

        if (rrnol(rr)) {
            return;
        }
        this.lastMetroCity = city
        const lst: MetroLine[] = rj(rr).data

        this.setState({ lines: this.reorderList(lst), })

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

    private displayDirection = () => {
        return this.lastMetroLine.direction == 12 ? this.lastMetroLine.end1 + "->" + this.lastMetroLine.end2 : this.lastMetroLine.end2 + "->" + this.lastMetroLine.end1
    }

    private reorderList(lst: MetroLine[]) {

        if (this.lastMetroLine) {
            const first: MetroLine = lst.find(m => m.id == this.lastMetroLine.id)
            if (isEmpty(first)) {
                return lst
            }
            const others: MetroLine[] = lst.filter(m => m.id != this.lastMetroLine.id)
            return [first].concat(others)
        }
        else {
            return lst
        }
    }

    private getLastCity(): { cityCode?: number, name?: string } {
        if (!isEmpty(this.lastMetroCity)) {
            return this.lastMetroCity
        }
        else if (global.lastCity) {
            return { cityCode: global.lastCity.cityCode, name: global.lastCity.cityName }
        }

        return {}
    }


    private commitReport = debounce(() => {
        showOngoingAlert()
        this.commitReportAction()
    }, 3000, true)

    private commitReportAction = () => {

        if (isEmpty(this.state.reportText)) {
            simpleAlert(null, "请填写一些内容")
            return;
        }

        const isconn = networkConnected()
        if (!isconn) {
            showNoNetworkAlert()
            return;
        }

        const uid = UserAccount.getUid();
        postService(commitReportUrl(), { uid: uid || "", content: this.state.reportText, type: 3 })
        .then(b => {
            hideMessage();
            this.setState({dialogVisible:false},()=>{
                setTimeout(() => {
                    simpleAlert(null, "发送成功")
                }, 1000);
            })
        });

        
        
    }


    private renderPopup = () => {
        const { dialogVisible, reportText } = this.state
        return (
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>错漏报告</Dialog.Title>
                <Dialog.Input placeholder='简单描述错漏内容' value={reportText}
                    onChangeText={(txt) => { this.setState({ reportText: txt }) }} />
                <Dialog.Button label="取消" onPress={() => { this.setState({ dialogVisible: false }) }} />
                <Dialog.Button label="发送" onPress={this.commitReport} />
            </Dialog.Container>
        )
    }



    private lastMetroLine: LastMetroLine
    private lastMetroCity: LastMetroCity
    public async componentWillMount() {

        const lastMetroLine: LastMetroLine = await getLastMetroLine()
        const lastMetroCity: LastMetroCity = await getLastMetroCity()
        if (!isEmpty(lastMetroCity)) {
            this.lastMetroCity = lastMetroCity
            
        }

        if (!isEmpty(lastMetroLine)) {
            this.lastMetroLine = lastMetroLine
            this.selectedLine = lastMetroLine
            this.setState({ currentLineId: lastMetroLine.id, direction: lastMetroLine.direction })
        }

        if (this.getLastCity()) {
            const rr = await getService(getMetroLinesUrl(this.getLastCity().cityCode))
            if (rrnol(rr)) {
                return;
            }

            const lst: MetroLine[] = rj(rr).data
            this.setState({ lines: this.reorderList(lst) })
        }
        else {
            if (Platform.OS == "android") {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            }


            await init();

            Geolocation.getCurrentPosition(({ coords }) => {

                const { latitude, longitude } = coords

                Geolocation.getReGeoCode({
                    latitude: latitude,
                    longitude: longitude,
                }, async (result) => {
                    global.lastCity = { cityCode: result.citycode, cityName: result.city }
                    saveLastCity({ cityName: result.city, cityCode: result.citycode })
                    const rr = await getService(getMetroLinesUrl(result.citycode))
                    if (rrnol(rr)) {
                        return;
                    }

                    const lst: MetroLine[] = rj(rr).data

                    this.setState({ lines: this.reorderList(lst) })
                });

            });
        }



    }

    private selectedLine: LastMetroLine
    private select = (line: MetroLine, direction) => {
        this.selectedLine = { ...line, direction }
        // saveLastMetroLine()
        this.setState({ currentLineId: line.id, direction })
        // this.go(line,direction)
    }




    private renderItem = (info: ListRenderItemInfo<MetroLine>) => {
        const { item } = info
        const { themedStyle } = this.props
        const { currentLineId, direction } = this.state
        let directionStyle1 = themedStyle.direction
        if (currentLineId && item.id == currentLineId && direction == 12) {
            directionStyle1 = themedStyle.selectedDirection
        }

        let directionStyle2 = themedStyle.direction
        if (currentLineId && item.id == currentLineId && direction == 21) {
            directionStyle2 = themedStyle.selectedDirection
        }

        return (
            <View style={{ flexDirection: 'column', height: 120 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#a3e9a4' }}><Text>{item.lineName}</Text></View>

                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingVertical: 5 }}>
                    <TouchableOpacity style={directionStyle1} onPress={() => this.select(item, 12)}>
                        <Text>
                            {item.end1}
                        </Text>
                        <MaterialCommunityIcons color="green" name="arrow-down-thick" />
                        <Text>
                            {item.end2}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={directionStyle2} onPress={() => this.select(item, 21)}>
                        <Text>
                            {item.end1}
                        </Text>
                        <MaterialCommunityIcons color="green" name="arrow-up-thick" />
                        <Text>
                            {item.end2}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }



    public componentDidMount() {

        this.selectCallback = this.props.navigation.getParam("selectCallback")

    }



    public render(): React.ReactNode {
        const { themedStyle } = this.props

        return (



            <PageView style={themedStyle.container} >
                {/* {this.renderSearchBar()} */}
                {this.renderPopup()}

                <View style={{ paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                        <Text appearance="hint" category="p2">{`当前城市:${this.getLastCity().name}`}</Text>
                        <Button onPress={this.goToCities} size="small" appearance="ghost" textStyle={themedStyle.contentText}>更改城市>></Button>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
                    <Text appearance="hint" category="p2">{`上一次选择路线: ${this.lastMetroLine ? this.lastMetroLine.lineName + " " + this.displayDirection() : ""}`}</Text>
                </View>

                <List
                    data={this.state.lines}
                    renderItem={this.renderItem}
                    getItemLayout={(data, index) => (
                        { length: 120, offset: 120 * index, index }
                    )}
                />

                <View style={{ paddingHorizontal: 16 }}>

                </View>
                <View>

                    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                            <Button style={{ backgroundColor: '#2baf2b', borderColor: '#2baf2b', width: 150 }} onPress={this.go}>上车</Button>
                            <TouchableOpacity style={{ position: 'absolute', right: 0, bottom: 0 }} onPress={()=>{this.setState({dialogVisible:true})}}>
                                <Text style={{ color: '#9e9e9e', fontSize: 13 }}>错漏报告</Text>
                            </TouchableOpacity>
                            {/* <Button appearance="ghost" size="small" textStyle={{color:'#9e9e9e'}} style={{position:'absolute',right:0,bottom:0}}>错漏报告</Button> */}
                        </View>

                    </View>





                </View>
            </PageView>

        );
    }


}





export const SelectMetrolLinePage = withStyles(SelectMetrolLine, (theme: ThemeType) => ({
    container: {
        flex: 1,
        backgroundColor: theme['background-basic-color-1'],
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme['background-basic-color-1'],
    },
    contentText: {
        color: theme["contentText-primary"]
    },
    direction: { alignItems: 'center', borderWidth: 1, borderRadius: 5, borderColor: '#dcedc8', padding: 5 },
    selectedDirection: { alignItems: 'center', borderRadius: 5, backgroundColor: '#dcedc8', padding: 5 }
}));