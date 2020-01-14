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
import { RestfulJson, postService, writeArticleUrl, qiniuImgUrl, getService, getQiniuTokenUrl, rrnol, rj, RestfulResult, updateArticleUrl, roadChatUrl, metroChatUrl } from '@src/core/uitls/httpService';
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
import { issueWarningText } from '@src/core/uitls/constants'
import debounce from '@src/core/uitls/debounce'
import { PageView } from '@src/pages/pageView';
import { MetroChat, MetroLine } from '@src/core/model/metro.model';


declare var global: globalFields

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

class IssueMetroChat extends React.Component<Props, State> {


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


  private displayDirection = () => {
    return this.direction == 12 ? this.metroLine.end1 + "->" + this.metroLine.end2 : this.metroLine.end2 + "->" + this.metroLine.end1
  }

  private warningText = issueWarningText

  private issue = debounce(() => {
    this.issueAction()
  }, 3000, true)

  private issueAction = async () => {

    if (isEmpty(this.state.content)) {
      simpleAlert(null, "内容不能为空")
      return
    }

    const s = onlineAccountState()
    if (s == 0 || s == -1) {
      showNoAccountOnAlert();
      return;
    }


    const ua = UserAccount.instance

    const test = await hasOverRoadChat(this.state.selectedRoad)
    if (test) {
      simpleAlert(null, this.warningText)
      return;
    }


    const chat: MetroChat = {
      uid: ua.id,
      nickname: ua.nickname,
      image: ua.image,
      chat: this.state.content,
      direction: this.direction.toString(),
      lineId: this.metroLine.id,
    }

    const rr = await postService(metroChatUrl(), chat)
    // console.warn(JSON.stringify(rr))
    if (rrnol(rr)) {
      return;
    }

    this.issueCallback()
    setTimeout(() => {
      this.props.navigation.goBack(KEY_NAVIGATION_BACK)
    }, 0);


  }



  private issueCallback: () => void
  private metroLine: MetroLine;
  private direction: 12 | 21


  public componentWillMount() {
    this.issueCallback = this.props.navigation.getParam("issueCallback")
    this.metroLine = this.props.navigation.getParam("metroLine")
    this.direction = this.props.navigation.getParam("direction")
  }





  public render(): React.ReactNode {
    const { themedStyle } = this.props
    const { content } = this.state
    return (
      <PageView style={themedStyle.container}>

        <Input label={`当前道路：${this.metroLine.lineName + " " + this.displayDirection()}`} placeholder="吐槽，冒泡，打呵欠，广播道路情报。。。" multiline={true} value={content} onChangeText={val => this.setState({ content: val })} />

        <Text style={{ marginTop: 20 }} appearance="hint">{this.warningText}</Text>

        <Button status="success" style={{ marginTop: 50, marginBottom: 50 }} onPress={this.issue}>发表</Button>


      </PageView>

    );
  }


}



export const IssueMetroChatPage = withStyles(IssueMetroChat, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical : 5
    // backgroundColor: theme['background-basic-color-1'],
  },
  addbutton: {
    backgroundColor: theme['color-success-400'],
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center'
  }
}));