import React from 'react';
import { View, ListRenderItemInfo, Modal, WebView, Platform, BackHandler } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout, List, Radio, ButtonProps } from 'react-native-ui-kitten';




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
    else{
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


  private url : string
  public componentWillMount(){

    this.props.navigation.setParams({//给导航中增加监听事件
      goBackPage: this.goBack
    });

    const url = this.props.navigation.getParam("url")
    this.url = url
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