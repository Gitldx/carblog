import React from 'react';
import { View, ImageProps } from 'react-native'
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
import ScrollableTabView,{DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {ScrollTabBar} from '@src/components'


type Props = ThemedComponentProps & NavigationScreenProps

type State = { selectedIndex: number, blogListLoaded: boolean }

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
        title: '挪车电话',
        icon: (styles) => MaterialCommunityIcons({ name: "phone", size: 20, color: styles.tintColor }) as any
      },
      {
        title: '找停车位',
        icon: (styles) => MaterialCommunityIcons({ name: "magnify", size: 20, color: styles.tintColor }) as any
      },
      {
        title: "分享停车位",
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


  public state: State = {
    selectedIndex: 0,
    blogListLoaded: false
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

  private park = () => {
    this.props.navigation.navigate("Park")
  }


  private sharePark = () => {
    this.props.navigation.navigate("SharePark")
  }

  private searchPark = () => {
    this.props.navigation.navigate("SearchPark")
  }


  private onChangeTab = (index) =>{
    if(index == 1){
      if(this.state.blogListLoaded == false){
        this.setState({blogListLoaded:true})
      }
    }
  }


  public componentWillMount() {

    this.props.navigation.setParams({
      "onSearchPressed": this.onSearchPressed, "park": this.park,
      "sharePark": this.sharePark, "searchPark": this.searchPark
    })
    this.props.navigation.addListener("didFocus",()=>{
      MessageLooper.instance.readParkMsg()
    })
  }


  public render(): React.ReactNode {
    const { themedStyle } = this.props
    return (
      <PageView style={themedStyle.container}>
        {/* <View style={{width:"100%",height:50,backgroundColor:'red'}}></View> */}
        {/* <TouchableOpacity style={{ flexDirection: 'row',paddingVertical:5 backgroundColor: '#fb7e00', justifyContent: 'center' }}>
          <FontAwesomeIcon size={18} name="car" color="white" />
          <Text style={{ color: 'white', fontSize: 18, marginHorizontal: 5 }}>停车中</Text>
          <FontAwesomeIcon size={18} name="truck" color="white" />
        </TouchableOpacity> */}

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
       
        <ScrollableTabView style={{marginTop:10,flex:1}}
        // renderTabBar={() => <ScrollableTabBar textStyle={{color:'#666666'}}/>}
        renderTabBar={() => <ScrollTabBar textStyle={{ fontSize: 14 }} style={{ height: 30 }} />}
        // renderTabBar={() => <DefaultTabBar textStyle={{ fontSize: 12, color: '#666666'  }} style={{ height: 30 }} />}
        onChangeTab={(obj) => { this.onChangeTab(obj.i) }}
        >       
            <ParkRank tabLabel="同城车币榜" navigation={this.props.navigation}/>
          
            <BlogList tabLabel="博客"  load={this.state.blogListLoaded} navigation={this.props.navigation} />

            <View tabLabel="同道中人"></View>
          
          
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