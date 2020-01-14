import React from 'react';
import { View, ListRenderItemInfo, Modal, WebView, Platform, BackHandler } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout, List, Radio, ButtonProps } from 'react-native-ui-kitten';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';




interface State {

}


type Props = ThemedComponentProps & NavigationScreenProps

export class Web extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '浏览'
    }
  }



  public state: State = {

  }


  public constructor(Props) {
    super(Props)
    this.addBackAndroidListener(Props.navigation)
  }


  private webView: WebView

  private canGoback: boolean = false;

  private onNavigationStateChange = navState => {
    this.canGoback = navState.canGoBack;
  };

  private goBack = () => {

    if (this.canGoback) {
      this.webView.goBack();
    }
    else {
      this.props.navigation.goBack()
    }

  }


  // 监听原生返回键事件
  private addBackAndroidListener(navigator) {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  private onBackAndroid = () => {
    if (this.canGoback) {
      this.webView.goBack();
      return true;
    } else {
      return false;
    }
  };


  private setUid = () => {
    if (UserAccount.instance.accountHasLogined == true) {
      this.webView.postMessage(UserAccount.getUid())
    }
  }

  private onMessage = (e) => {
    let string_data = e.nativeEvent.data
    
    if(Platform.OS === "ios"){
      // IOS returns the data url encoded/percent-encoding twice
      // unescape('%257B') -> %7B
      // unescape(%7B) -> {
      string_data = unescape(unescape(string_data));
    }
    const msg = JSON.parse(string_data)
    const event = msg.event

    if (event == 'finish') {
       this.props.navigation.goBack(KEY_NAVIGATION_BACK)
    }
  
}


  private url: string
  public componentWillMount() {

    this.props.navigation.setParams({//给导航中增加监听事件
      goBackPage: this.goBack
    });

    const url = this.props.navigation.getParam("url")
    this.url = url
  }

  public componentWillUnmount(){
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }



  public render(): React.ReactNode {

    const { themedStyle } = this.props
    const { } = this.state
    return (
      <View style={{ flex: 1 }}>
        {/* <Button onPress={this.goBack}>返回</Button> */}
        <WebView
          
          source={{ uri: this.url }}
          // style={{marginTop: 20}}
          ref={ref => this.webView = ref}
          onNavigationStateChange={this.onNavigationStateChange}
          onLoadEnd={this.setUid}
          onMessage = {this.onMessage}
        />
      </View>
    );
  }
}


export const WebPage = withStyles(Web, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: theme['background-basic-color-1'],
  }
}));