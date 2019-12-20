import React from 'react';
import { View, ListRenderItemInfo, StyleSheet, Text, TextInput } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, withStyles, ThemeType, Text as RKText, ThemedComponentProps, Layout, List, Radio, ButtonProps } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar, ScrollableAvoidKeyboard, Input } from '@src/components/common';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { PageView } from '../pageView';
import { InputSetting } from '@src/components';
import { AccountRoleType } from '@src/core/userAccount/type';
import { ProfilePhoto } from './profilePhoto.component'
import { CameraIconFill, PersonIconFill, PersonImage, MaterialCommunityIcons } from '@src/assets/icons';
import { author1 } from '@src/core/data/articles';
import { getService, getUserAccountUrl, getProfileUrl, rj, postService, commitReportUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { isEmpty, showNoNetworkAlert } from '@src/core/uitls/common';
import { simpleAlert } from '@src/core/uitls/alertActions';
import { networkConnected } from '@src/core/uitls/netStatus';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';



interface State {
  reportText: string,
  type:0|1|2
}


type Props = ThemedComponentProps & NavigationScreenProps

export class MyReport extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '意见，投诉，商务沟通'
    }
  }

  public state: State = {
    reportText: "",
    type:0
  }


  private onRadioChecked = (value:AccountRoleType) => {
    this.setState({ type: value})
  }


  private commitReport = () => {

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
    postService(commitReportUrl(), { uid: uid || "", content: this.state.reportText, type: this.state.type });


    this.props.navigation.goBack(KEY_NAVIGATION_BACK)

    simpleAlert(null, "发送成功")
  }


  public render(): React.ReactNode {

    const { themedStyle } = this.props
    const { reportText,type } = this.state
    return (
      <PageView style={{ flex: 1 }}>

        <TextInput multiline={true} numberOfLines={10} value={reportText} onChangeText={txt => this.setState({ reportText: txt })}
          style={themedStyle.textInput}
          placeholderTextColor={themedStyle.textInputPlaceHolder.color}
          placeholder='在此写下您使用中的问题反映，投诉建议，沟通交流等信息。感谢您的热心反馈'
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingVertical: 15 }}>
          <Radio status="success"
            text="意见"
            checked={type == 0}
            onChange={() => this.onRadioChecked(0)}
          />
          <Radio status="success"
            text="投诉"
            checked={type == 1}
            onChange={() => this.onRadioChecked(1)}
          />
          <Radio status="success"
            text="商务"
            checked={type == 2}
            onChange={() => this.onRadioChecked(2)}
          />
        </View>

        <Button style={{ marginHorizontal: 10 }} onPress={this.commitReport}>提交</Button>
      </PageView>
    );
  }
}


const styles = StyleSheet.create({
  blanceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingLeft: 10, paddingRight: 50
  },
  balanceBlock: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 80,
    flexDirection: 'column'
  },
  balanceText: { textAlign: 'center', fontSize: 18, color: '#5ed125' },
})


export const MyReportPage = withStyles(MyReport, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: theme['background-basic-color-1'],
  },
  textInput: {
    marginHorizontal: 10, marginVertical: 10,
     height: 160, borderRadius: 4,
    padding: 5,
    backgroundColor: theme['background-basic-color-1'],
    color: theme['text-basic-color']
  },
  textInputPlaceHolder: {
    color: theme["text-hint-color"]
  }
}));