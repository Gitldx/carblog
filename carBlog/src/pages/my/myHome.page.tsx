import React from 'react';
import { View, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar } from '@src/components/common';
import { ThemeContext, ThemeContextType } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { PageView } from '../pageView';
import EventRegister, { loginEvent } from '@src/core/uitls/eventRegister';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { showMessage } from 'react-native-flash-message';
import { showNoAccountOnAlert, showNoNetworkAlert } from '@src/core/uitls/common';
import { LoginEventData } from '@src/core/userAccount/type';
import { networkConnected } from '@src/core/uitls/netStatus';
import debounce from "@src/core/uitls/debounce"
import { simpleAlert } from '@src/core/uitls/alertActions';
import { JSAPIVERSION_ANDROID } from '@src/core/uitls/constants';


type DayNight = "day" | "night"

interface State {
  mode: DayNight,
  hasLogin: boolean
}


type Props = ThemedComponentProps & NavigationScreenProps

export class MyHome extends React.Component<Props, State> {

  public state: State = {
    mode: "day",
    hasLogin: false
  }


  private onChangeMode = (context: ThemeContextType) => {

    context.currentTheme == "Eva Light" ? context.toggleTheme("Eva Dark") : context.toggleTheme("Eva Light")

    const value = this.state.mode == "day"
    const mode: DayNight = value ? "night" : "day"
    this.setState({ mode })
  }


  private renderLeftKit = () => {
    const { mode } = this.state
    const iconName = mode == "night" ? "ios-moon" : "ios-sunny"
    const text = mode == "night" ? "夜间模式" : "白天模式"
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text category="p1" style={{ marginRight: 10 }}>{text}</Text>
        <Icon name={iconName} size={25} color={"yellow"} />
      </View>
    )
  }

  private renderDayNightToggleKit = (context: ThemeContextType) => {

    const { mode } = this.state
    const isDay: boolean = mode == "night"
    return (
      <Toggle size="small"
        checked={isDay}
      // onChange={()=>this.onChangeMode(context)}
      />
    )
  }


  private gotoShop = () => {
    this.props.navigation.navigate("myShop")
  }

  private login = () => {
    this.props.navigation.navigate("SignIn")
  }


  private signOut = () => {
    UserAccount.instance.logout()
  }


  private register = () => {
    this.props.navigation.navigate("SignUp")
  }


  private gotoMyBlogs = () => {
    const s = onlineAccountState()
    if (s == 0) {
      showNoAccountOnAlert();
      return;
    }
    this.props.navigation.navigate({ routeName: "MyBlogs" })
  }

  private gotoMyInfo = () => {
    const s = onlineAccountState()
    if (s == 0) {
      showNoAccountOnAlert();
      return;
    }
    this.props.navigation.navigate({ routeName: "MyInfo" })
  }


  private gotoMyReport = () => {
    if(!networkConnected()){
      showNoNetworkAlert()
      return
    }
    this.props.navigation.navigate({ routeName: "MyReport" })
  }


  private count = 0
  private debounce = debounce(()=>{
    console.warn(++this.count)
  },2000,false)
  private testDebounce=()=>{
    // this.debounce()
    simpleAlert(null,JSAPIVERSION_ANDROID)
  }


  public componentWillMount = () => {
    EventRegister.addEventListener(loginEvent, (data:LoginEventData) => {
      const { stateStr, accountHasLogined } = data
      // console.warn(`loginEvent:${accountHasLogined}`)
      if (accountHasLogined == true) {
        this.setState({ hasLogin: true })
      }
      else {
        this.setState({ hasLogin: false })
      }
    })

    const userState = onlineAccountState()
    // console.warn(`userState:${userState}`)
    if (userState == 1 || userState == 2) {
      this.setState({ hasLogin: true })
    }

  }


  public render(): React.ReactNode {

    const { themedStyle } = this.props
    return (
      <PageView style={themedStyle.container}>

        {/* <ButtonBar style={{ marginTop: 5 }} leftText="我的后车箱" onPress={this.gotoShop} /> */}
        <ButtonBar style={{ marginTop: 5 }} leftText="我的博客"
          /* rightKit={() => <View style={{ backgroundColor: 'red', width: 8, height: 8, borderRadius: 4 }} />} */
          onPress={this.gotoMyBlogs}
        />

        {/* <ButtonBar leftText="我的收藏" style={{ marginTop: 5 }}
          onPress={() => this.props.navigation.navigate({ routeName: "MyCollection" })}
        /> */}
        <ButtonBar leftText="用户信息"
          onPress={this.gotoMyInfo}
        />
        <ButtonBar leftText="积分，游戏规则"
          onPress={() => this.props.navigation.navigate({ routeName: "MyScore" })}
        />

        <ThemeContext.Consumer>
          {(context: ThemeContextType) => (
            <ButtonBar showIcon={false} style={{ marginTop: 10 }}
              leftKit={this.renderLeftKit}
              rightKit={() => this.renderDayNightToggleKit(context)}
              onPress={() => this.onChangeMode(context)}
            />
          )}
        </ThemeContext.Consumer>

        <ButtonBar leftText="意见，投诉，商务沟通"
          onPress={this.gotoMyReport}
        />

        <View style={{ marginHorizontal: 10, marginVertical: 18, paddingHorizontal: 8, paddingVertical: 4 }}>
          {!!!this.state.hasLogin ?
            <React.Fragment>
              <Button onPress={this.login}>登录</Button>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity style={{ paddingVertical: 6 }} onPress={this.register} >
                  <Text style={{ textAlign: 'center' }} category="p1" status="warning">没有账号？点击注册</Text>

                </TouchableOpacity>

              </View>
            </React.Fragment>
            :
            <Button onPress={() => UserAccount.instance.logout()}>退出账号</Button>
          }
        </View>


          {/* <Text>test0</Text>
          <Button onPress={this.testDebounce}>测试</Button> */}
      </PageView>

    );
  }
}


export const MyHomePage = withStyles(MyHome, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: theme['background-basic-color-1'],
  }
}));