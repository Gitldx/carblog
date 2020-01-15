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
import { parkUrl, getService, shareParkUrl, getNearestPointUrl, rj, countRoadChatUrl, rrnol, getMetroLinesUrl, getMetroCitiesUrl, postService, commitReportUrl } from '@src/core/uitls/httpService';
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
import { saveLastLocation, getLastLocation, LocationStorage, saveLastCity, LastMetroLine, getLastMetroLine, saveLastMetroLine, LastMetroCity, getLastMetroCity, saveLastMetroCity } from '@src/core/uitls/storage/locationStorage';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { Toast, DURATION, COLOR } from '@src/components'
import { getSevertimeDiff } from '@src/core/uitls/readParameter';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { networkConnected } from '@src/core/uitls/netStatus';
import { MetroLine } from '@src/core/model/metro.model';
import Dialog from 'react-native-dialog'
import debounce from '@src/core/uitls/debounce'




type Props = ThemedComponentProps & NavigationScreenProps

type city = { cityCode: number, name: string }

type State = {
    cities: city[],

}


class SelectMetrolCity extends React.Component<Props, State> {

    static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
        return {

            title: '选择城市'
        }
    }


    private selectedPoint: { lat: number, lng: number, citycode: number }
    private selectCallback: (city: city) => void


    public state: State = {
        cities: [],

    }


    public async componentWillMount() {
        this.selectCallback = this.props.navigation.getParam("selectCallback")
        const rr = await getService(getMetroCitiesUrl())
        if (rrnol(rr)) {
            return;
        }
        const lst: city[] = rj(rr).data
        this.setState({ cities: lst })

    }

    private select = (city: city) => {
        saveLastMetroCity(city)
        this.selectCallback(city);
        setTimeout(() => {
            this.props.navigation.goBack(KEY_NAVIGATION_BACK)
        }, 0);
    }

    private renderItem = (info: ListRenderItemInfo<city>) => {
        const { item } = info

        return (
            <ListItem onPress={() => this.select(item)} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text>{item.name}</Text>
            </ListItem>
        )
    }





    public componentDidMount() {

        this.selectCallback = this.props.navigation.getParam("selectCallback")

    }



    public render(): React.ReactNode {
        const { themedStyle } = this.props

        return (



            <PageView style={themedStyle.container} >

                <List
                    data={this.state.cities}
                    renderItem={this.renderItem}
                />

                <View style={{ paddingHorizontal: 16 }}>

                </View>
                {/* <View>

                    <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                        <View style={{ marginTop: 10 }}>
                            <Button onPress={this.go}>切换道路</Button>
                        </View>

                    </View>





                </View> */}
            </PageView>

        );
    }


}





export const SelectMetrolCityPage = withStyles(SelectMetrolCity, (theme: ThemeType) => ({
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