import React from 'react';
import { NativeModules, View, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ListRenderItemInfo, ImageSourcePropType, PermissionsAndroid } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, List, } from 'react-native-ui-kitten';


import { Input, ScrollableAvoidKeyboard } from '@src/components/common';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { ImageSource } from '@src/assets/images';
import { MaterialCommunityIcons } from '@src/assets/icons';
import { blogList, author1, articles } from '@src/core/data/articles';
import { RestfulJson, postService, writeArticleUrl, qiniuImgUrl, getService, getQiniuTokenUrl, rrnol, rj, RestfulResult, updateArticleUrl, roadChatUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Article, RoadChat, globalFields } from '@src/core/model';
import { isEmpty, toDate, showNoNetworkAlert, gcj2wgs, showNoAccountOnAlert } from '@src/core/uitls/common';
import { simpleAlert } from '@src/core/uitls/alertActions';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import Spinner from 'react-native-loading-spinner-overlay';
import { init, Geolocation } from '@src/components/amap/location';
import Amap from '@src/components/amap'
import { hasOverRoadChat } from './parkUtils';
import { onlineAccountState } from '@src/core/userAccount/functions';
import {issueWarningText} from '@src/core/uitls/constants'
import debounce from '@src/core/uitls/debounce'


declare var global : globalFields

type Props = ThemedComponentProps & NavigationScreenProps

type State = {
  content: string, spinner: boolean,
  mapHeight: number,
  mapShow: boolean,
  initLatitude: number,
  initLongitude: number,
  selectedRoad: string,
  tooltipVisible: boolean,
  limitRegion: any
}

class IssueChat extends React.Component<Props, State> {


  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {



    return {
      title: '发言',
    }
  }



  public state: State = {
    content: "",
    spinner: false,
    mapHeight: 0,
    mapShow: false,
    initLatitude: null,
    initLongitude: null,
    selectedRoad: '',
    tooltipVisible: false,
    limitRegion: null
  }



  private keyboardOffset: number = Platform.select({
    ios: 40,
    android: 30,
  });


  private warningText = issueWarningText

  private issue = debounce(()=>{
    this.issueAction()
  },3000,true)

  private issueAction = async () => {

    if(isEmpty(this.state.content)){
      simpleAlert(null,"内容不能为空")
      return
    }

    const s = onlineAccountState()
    if (s == 0 || s == -1) {
      showNoAccountOnAlert();
      return;
    }


    const ua = UserAccount.instance

    const test = await hasOverRoadChat(this.state.selectedRoad)
    if(test){
      simpleAlert(null,this.warningText)
      return;
    }


    const {longitude,latitude} = this.selectedPoint
    const {lng,lat} = gcj2wgs(longitude,latitude)

    const chat: RoadChat = {
      uid: ua.id,
      role: ua.role,
      nickname: ua.nickname,
      image : ua.image,
      carNumber: ua.carNumber,
      chat: this.state.content,
      cityCode: global.lastCity.cityCode,
      road: this.state.selectedRoad,
      location: { coordinates: [lng, lat] },
      gcjLocation: [longitude, latitude]
    }

    const rr = await postService(roadChatUrl(), chat)
    // console.warn(JSON.stringify(rr))
    if (rrnol(rr)) {
      return;
    }

    this.issueCallback(this.state.selectedRoad,lng,lat)
    setTimeout(() => {
      this.props.navigation.goBack(KEY_NAVIGATION_BACK)
    }, 0);


  }


  private selectedPoint :{longitude:number,latitude:number}

  private onMapPressed = async (e) => {
    let { longitude, latitude, } = e.nativeEvent

    this.selectedPoint = {longitude,latitude}

    Geolocation.getReGeoCode({ latitude, longitude }, (result) => {
      this.setState({ selectedRoad: result.road })
    });


  }

  private renderMapview() {

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
          latitude: this.state.initLatitude,
          longitude: this.state.initLongitude
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
            latitude: this.state.initLatitude,
            longitude: this.state.initLongitude
          }}
        />
      </Amap>
    )
  }


  public async componentWillMount() {
    if (Platform.OS == "android") {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    }

    await init();

    Geolocation.getCurrentPosition(({ coords }) => {
      // console.warn("---->" + JSON.stringify(coords));

      const { latitude, longitude } = coords

      this.selectedPoint = {longitude,latitude}

      Geolocation.getReGeoCode({
        latitude: latitude,
        longitude: longitude,
      }, (result) => {
        global.lastCity = {cityCode:result.citycode,cityName:result.city}
        this.setState({ selectedRoad: result.road })
      });

      setTimeout(() => {
        this.setState({ mapShow: true, initLongitude: longitude, initLatitude: latitude }, () => {
          setTimeout(() => this.setState({
            limitRegion: {
              latitude: this.state.initLatitude,
              longitude: this.state.initLongitude, latitudeDelta: 0.01, longitudeDelta: 0.01
            }
          }), 1000)//todo:记得取消注释
        })
      }, 500);


    });
  }

  private issueCallback : (road,lng_wgs,lat_wgs)=>void
  public componentDidMount() {

    this.issueCallback = this.props.navigation.getParam("issueCallback")

  }


  public render(): React.ReactNode {
    const { themedStyle } = this.props
    const { content } = this.state
    return (
      <ScrollableAvoidKeyboard style={themedStyle.container} extraScrollHeight={this.keyboardOffset}>

        <View style={{ marginBottom: 20, height: 300 }}>
          {this.state.mapShow ? this.renderMapview() : null}
        </View>

        <Input label={`当前道路：${this.state.selectedRoad}`} placeholder="吐槽，冒泡，打呵欠，广播道路情报。。。" multiline={true} value={content} onChangeText={val => this.setState({ content: val })} />

        <Text style={{ marginTop: 20 }} appearance="hint">{this.warningText}</Text>

        <Button status="success" style={{ marginTop: 50, marginBottom: 50 }} onPress={this.issue}>发表</Button>


      </ScrollableAvoidKeyboard>

    );
  }


}


const styles = StyleSheet.create({

})


export const IssueChatPage = withStyles(IssueChat, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10
    // backgroundColor: theme['background-basic-color-1'],
  },
  addbutton: {
    backgroundColor: theme['color-success-400'],
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center'
  }
}));