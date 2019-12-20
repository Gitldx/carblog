import React from 'react';
import { View, BackHandler, NativeModules, Platform, Alert } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, OverflowMenuItemType, } from 'react-native-ui-kitten';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import { PageView } from '../pageView';
import { BlogList } from './blogList.component';
import { ScrollPageView } from '../scrollPageView';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Input } from '@src/components/common';
import { MaterialCommunityIcons } from '@src/assets/icons';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { Config } from '@src/core/uitls/config';
import { TopNavigationOptions } from '@src/core/navigation/options';
import { ShopList } from './shopList.componen';
import { SearchPlaceholder, PopupMenu } from '@src/components';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { AskParkList } from './park/askParkList.component';
import { ParkRank } from './park/parkRank.component';
import { MessageLooper } from '@src/core/uitls/messageLooper';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { ScrollTabBar } from '@src/components'
import { hasInitOnlineAppState } from '@src/core/userAccount/functions';
import EventRegister, { initAppOnlineCompleteEvent, loginEvent, upgradeEvent } from '@src/core/uitls/eventRegister';
import { getService, parkGetUrl, RestfulJson } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Park, globalFields } from '@src/core/model';
import { LoginEventData } from '@src/core/userAccount/type';
import codePush, { DownloadProgress, UpdateDialog } from "react-native-code-push";
import Spinner from 'react-native-loading-spinner-overlay';
import { RoadChatList } from './roadChatList.component';
import { Upgrade } from '@src/core/uitls/upgradeUtil';

const NativeAPI = NativeModules.NativeAPI

declare var global: globalFields

type Props = ThemedComponentProps & NavigationScreenProps

type State = {
  selectedIndex: number,
  blogListLoaded: boolean,
  parkRankListLoaded: boolean,
  /**
   * 0:开车状态，1:停车状态
   */
  parkStatus: number
}

class Home extends React.Component<Props, State> {

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
    const onSearchPressed = navigation.getParam("onSearchPressed")
    const park = navigation.getParam("park")
    const sharePark = navigation.getParam("sharePark")
    const searchPark = navigation.getParam("searchPark")
    const centerControl = <SearchPlaceholder onSearch={onSearchPressed} />//<Input placeholder="搜车牌号看车主" onFocus={()=>console.warn("lele")}/>
    const centerWidth = 250

    const items: OverflowMenuItemType[] = [
      {
        text: '挪车电话',
        icon: (styles) => MaterialCommunityIcons({ name: "phone", size: 20, color: styles.tintColor }) as any
      },
      {
        text: '找停车位',
        icon: (styles) => MaterialCommunityIcons({ name: "magnify", size: 20, color: styles.tintColor }) as any
      },
      {
        text: "分享停车位",
        icon: (styles) => MaterialCommunityIcons({ name: "share", size: 20, color: styles.tintColor }) as any
      }
    ];

    const onItemSelect = (index: number) => {
      switch (index) {
        case 0:
          park();
          break;
        case 1:
          searchPark()
          break;
        case 2:
          sharePark();
          break;
      }
    }

    const btn = (cb: () => void) => {
      return (
        <TouchableOpacity onPress={cb}>
          <MaterialCommunityIcons name="car" color={getThemeValue("color-success-default", themes["App Theme"])} />
        </TouchableOpacity>
      )
    }


    const rightControls = (
      <PopupMenu items={items} onItemSelect={onItemSelect} customButton={btn} />

    )
    return {
      centerControl,
      centerWidth,
      rightControls,
      // title: '首页'
    }
  }


  private parkData: Park


  public state: State = {
    selectedIndex: 0,
    blogListLoaded: false,
    parkRankListLoaded: false,
    parkStatus: 0
  }

  private onSelect = (selectedIndex: number) => {
    if (selectedIndex == 1 && !this.blogListHasLoaded) {
      this.blogListHasLoaded = true
      this.setState({ selectedIndex, blogListLoaded: true });
    }
    else {
      this.setState({ selectedIndex });
    }

  };

  private blogListHasLoaded: boolean = false
  // private shouldLoadTabContent = (index: number): boolean => {
  //   if (index == 1 && this.state.selectedIndex == 1) {
  //     this.blogListHasLoaded = true
  //   }
  //   if (this.blogListHasLoaded == true) {
  //     return true;
  //   }
  //   return index === this.state.selectedIndex;
  // };

  private onSearchPressed = () => {

    this.props.navigation.navigate("SearchCar")
  }

  private changeParkData = (data: Park) => {
    if (data) {
      this.parkData = data
      this.setState({ parkStatus: 1 })
    }
    else {
      this.parkData = null
      this.setState({ parkStatus: 0 })
    }
  }

  private park = () => {
    this.props.navigation.navigate("Park", { park: this.parkData, callback: this.changeParkData })
  }


  private sharePark = () => {
    this.props.navigation.navigate("SharePark")
  }

  private searchPark = () => {
    this.props.navigation.navigate("SearchPark")
  }


  private onChangeTab = (index) => {
    if (index == 1) {
      if (this.state.parkRankListLoaded == false) {
        this.setState({ parkRankListLoaded: true })
      }
    }
    else if (index == 2) {
      if (this.state.blogListLoaded == false) {
        this.setState({ blogListLoaded: true })
      }
    }
  }



  private initParkStatus = async () => {
    const uid = UserAccount.getUid()
    if (uid != null) {
      const rj = await getService(parkGetUrl(UserAccount.getUid())) as RestfulJson

      const p: Park = rj.data
      this.parkData = p
      if (this.parkData) {
        this.setState({ parkStatus: 1 })
      }
    }

  }

  private listenLoginEvent = () => {
    EventRegister.addEventListener(loginEvent, (data: LoginEventData) => {
      if (!data.onLaunch) {
        if (data.accountHasLogined) {
          this.initParkStatus()
        }
        else {
          this.parkData = null
          this.setState({ parkStatus: 0 })
        }
      }
    })

  }

  private onBackAndroid() {
    // if (global.lastBackPressed && global.lastBackPressed + 2000 >= Date.now()) {
    //   return false;
    // }
    // global.lastBackPressed = Date.now();
    // ToastAndroid.show('再按一次退出应用', 1000);

    // return true;

    NativeAPI.backToHome()
  }


  private listenHardwareBackPress() {
    if (Platform.OS == "android") {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  private removeHardwareBackPress() {
    if (Platform.OS == "android") {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }



  public componentWillMount() {

    this.props.navigation.setParams({
      "onSearchPressed": this.onSearchPressed, "park": this.park,
      "sharePark": this.sharePark, "searchPark": this.searchPark
    })
    this.props.navigation.addListener("didFocus", () => {
      MessageLooper.instance.readParkMsg()
      this.listenHardwareBackPress()
    })
    this.props.navigation.addListener("didBlur", () => {
      this.removeHardwareBackPress()
    })
  }


  public componentDidMount() {
    if (hasInitOnlineAppState()) {
      this.initParkStatus()
    }
    else {
      EventRegister.addEventListener(initAppOnlineCompleteEvent, () => {
        this.initParkStatus()

        const upgrade = new Upgrade(this.props.navigation)
        upgrade.codePush()
        // this.props.navigation.navigate("UpgradeModel", { isMandatory: true })
      })
    }

    this.listenLoginEvent()

    // setTimeout(() => {
    //   this.props.navigation.navigate("UpgradeModel")
    //   let count=0
    //   setInterval(()=>{
    //     EventRegister.emitEvent(upgradeEvent,++count)
    //   },1000)
    // }, 10000);

  }


  public render(): React.ReactNode {
    const { themedStyle } = this.props
    const { parkStatus } = this.state
    return (
      <PageView style={themedStyle.container}>
        {/* <View style={{width:"100%",height:50,backgroundColor:'red'}}></View> */}
        {/* <Spinner
          visible={this.state.spinner}
          textContent={'请稍等...'}
          textStyle={{ color: 'white' }}
        /> */}
        {parkStatus == 1 &&
          <TouchableOpacity onPress={this.park}
            style={{ flexDirection: 'row', paddingVertical: 5, backgroundColor: '#fb7e00', justifyContent: 'center' }}>
            <FontAwesomeIcon size={18} name="car" color="white" />
            <Text style={{ color: 'white', fontSize: 18, marginHorizontal: 5 }}>停车中</Text>
            <FontAwesomeIcon size={18} name="truck" color="white" />
          </TouchableOpacity>
        }
        {/* <TouchableOpacity onPress={this.sharePark}
          style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: getThemeValue("color-success-default", themes['App Theme']), justifyContent: 'space-between' }}>
        
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: 'white', fontSize: 18 }}>停车位</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>（福田区xx路...）</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: 'white', fontSize: 18 }}>10分钟前</Text>
            <FontAwesomeIcon size={18} name="hand-o-right" color="white" />
          </View>
        </TouchableOpacity> */}

        {/* 
        <TouchableOpacity onPress={this.sharePark}
          style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, backgroundColor: getThemeValue("color-warning-default", themes['App Theme']), justifyContent: 'space-between' }}>
         
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: 'white', fontSize: 18 }}>车位求助</Text>
            <Text style={{ color: 'white', fontSize: 14 }}> 粤B·JHG345</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>  1.2公里</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: 'white', fontSize: 18 }}>1分钟前</Text>
            <FontAwesomeIcon size={18} name="hand-o-right" color="white" />
          </View>
        </TouchableOpacity> */}

        {/* <TabView style={{ flex: 1, paddingBottom: 32 }}
          selectedIndex={this.state.selectedIndex}
          onSelect={this.onSelect}
        > */}
        {/* <Tab title="后车箱">
            <ShopList navigation={this.props.navigation} />
          </Tab> */}
        {/* <Tab title="同城车币榜">
            <ParkRank navigation={this.props.navigation}/>
          </Tab>
         
          <Tab title="博客">
            <BlogList load={this.state.blogListLoaded} navigation={this.props.navigation} />
          </Tab>
        </TabView> */}

        <ScrollableTabView style={{ marginTop: 10, flex: 1 }}
          // renderTabBar={() => <ScrollableTabBar textStyle={{color:'#666666'}}/>}
          renderTabBar={() => <ScrollTabBar textStyle={{ fontSize: 14 }} style={{ height: 30 }} />}
          // renderTabBar={() => <DefaultTabBar textStyle={{ fontSize: 12, color: '#666666'  }} style={{ height: 30 }} />}
          onChangeTab={(obj) => { this.onChangeTab(obj.i) }}
        >

          <RoadChatList tabLabel="同道中人" navigation={this.props.navigation} />

          <ParkRank tabLabel="同城车币榜" load={this.state.parkRankListLoaded} navigation={this.props.navigation} />

          <BlogList tabLabel="博客" load={this.state.blogListLoaded} navigation={this.props.navigation} />




        </ScrollableTabView>

      </PageView>

    );
  }


}


export const HomePage = withStyles(Home, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: theme['background-basic-color-1'],
  }
}));