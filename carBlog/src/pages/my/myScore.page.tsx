import React from 'react';
import { View, ListRenderItemInfo, StyleSheet, Text } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, withStyles, ThemeType, Text as RKText, ThemedComponentProps, Layout, List, Radio, ButtonProps } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar, ScrollableAvoidKeyboard } from '@src/components/common';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { PageView } from '../pageView';
import { InputSetting } from '@src/components';
import { AccountRoleType } from '@src/core/userAccount/type';
import { ProfilePhoto } from './profilePhoto.component'
import { CameraIconFill, PersonIconFill, PersonImage, MaterialCommunityIcons } from '@src/assets/icons';
import { author1 } from '@src/core/data/articles';
import { postService, setUserInfoUrl, RestfulJson, RestfulResult, getService, getUserAccountUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';



interface State {
  role: AccountRoleType,
  nickname: string,
  carNumber: string,
  phone: string
}


type Props = ThemedComponentProps & NavigationScreenProps

export class MyScore extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '我的成就'
    }
  }

  public state: State = {
    role: 1,
    nickname: "用户201908565",
    carNumber: "",
    phone: ""
  }



  private edit = () => {
    this.props.navigation.navigate("myBlog")
  }


  private save = async () => {
    const rj: RestfulJson = await postService(setUserInfoUrl(), { id: UserAccount.getUid(), ...this.state }) as any
    if (rj.ok) {
      UserAccount.instance.setInfo({ ...this.state })
    }
  }


  private onRadioChecked = (value: AccountRoleType) => {
    this.setState({ role: value })
  }


  private renderPhotoButton = (): React.ReactElement<ButtonProps> => {
    const { themedStyle } = this.props;

    return (
      <Button
        style={themedStyle.photoButton}
        activeOpacity={0.95}
        icon={CameraIconFill}
      // onPress={this.onPhotoButtonPress}
      />
    );
  };


  public async componentWillMount() {

    const rj: RestfulJson = await getService(getUserAccountUrl(UserAccount.getUid())) as any

    const ua: UserAccount = rj.data;

    this.setState({ role: ua.role, nickname: ua.nickname, carNumber: ua.carNumber, phone: ua.phone })

  }

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    const { role, nickname, carNumber, phone } = this.state
    return (
      <PageView style={{ flex: 1 }}>
        {/* <View style={{ flexDirection: 'row',justifyContent:'space-around',padding:30 }}>

          <View style={{ flex: 1,marginRight:20}}>
            <View style={styles.balanceBlock}>
              <View style={{ height: 50, justifyContent: 'center' }}>
                <Text style={styles.balanceText}>10</Text>
              </View>
              <View style={{ flex: 1, flexDirection:'row',alignItems:'center',justifyContent: 'center', backgroundColor: '#CCFFCC',borderBottomEndRadius:8,borderBottomLeftRadius:8 }}>
                <MaterialCommunityIcons name="medal" size={18} color="red"/>
                <Text style={{ textAlign: 'center', fontSize: 14, color: 'grey' }}>已送车位币</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1,marginLeft:20 }}>
            <View style={styles.balanceBlock}>
              <View style={{ height: 50, justifyContent: 'center' }}>
                <Text style={[styles.balanceText]}>{"20"}</Text>
              </View>
              <View style={{ flex: 1,flexDirection:'row',alignItems:'center', justifyContent: 'center', backgroundColor: '#CCFFCC',borderBottomEndRadius:8,borderBottomLeftRadius:8  }}>
                <MaterialCommunityIcons name="medal" size={18} color="gold"/>
                <Text style={{ textAlign: 'center', fontSize: 14, color: "grey" }}>车位币余额</Text>
              </View>
            </View>
          </View>

        </View> */}
        <View style={styles.blanceRow}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="medal" size={18} color="gold" />
            <RKText>车位币余额</RKText>
          </View>
          <Text style={[styles.balanceText,{color:'gold'}]}>{"20"}</Text>
        </View>
        <View style={styles.blanceRow}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="medal" size={18} color="green" />
            <RKText>累计生产车位币</RKText>
          </View>
          <Text style={[styles.balanceText,{color:'green'}]}>{"20"}</Text>
        </View>
        <View style={styles.blanceRow}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="medal" size={18} color="red" />
            <RKText>已赠送车位币</RKText>
          </View>
          <Text style={[styles.balanceText,{color:'red'}]}>{"20"}</Text>
        </View>

        <View style={{ paddingHorizontal: 5,marginTop:10 }}>
          <RKText appearance="hint" category="h6" style={{ textAlign: 'center' }}>车位币规则</RKText>
          <RKText appearance="hint" category="s1">
            车位币的用途
        </RKText>
          <RKText appearance="hint" category="p2">
            查看附近的车位信息，将会消耗 (车位信息条数 x 0.1) 个车位币
        </RKText>
          <RKText appearance="hint" category="s1" style={{ marginTop: 5 }}>
            如何自己生产车位币
        </RKText>
          <RKText appearance="hint" category="p2">
            {"1、每在地图上分享一次车位信息，不管有没有车主获得帮助，你都可以获得0.1个车位币。\n2、打赏给信息分享者，每给分享人打赏1元钱，自己可获得1个车位币"}
          </RKText>
          <RKText appearance="hint" category="s1" style={{ marginTop: 5 }}>
            如何帮其他车主生产车位币
        </RKText>
          <RKText appearance="hint" category="p2">
            停车时使用其他车主分享的空车位信息，随即赠送给分享人1个车位币，<RKText style={{color:getThemeValue("color-warning-default",themes["App Theme"])}} category="p2">赠送车位币并不会消耗你自己的车位币，但会增加对方的车位币</RKText>
        </RKText>
        </View>


      </PageView>
    );
  }
}


const styles = StyleSheet.create({
  blanceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10,paddingLeft:10,paddingRight:50
  },
  balanceBlock: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 80,
    flexDirection: 'column'
  },
  balanceText: { textAlign: 'center', fontSize: 18, color: '#5ed125' },
})


export const MyScorePage = withStyles(MyScore, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: theme['background-basic-color-1'],
  },
  photoSection: {
    marginVertical: 40,
  },
  photo: {
    width: 124,
    height: 124,
    alignSelf: 'center',
  },
  photoButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    transform: [{ translateY: 82 }],
    borderColor: theme['border-basic-color-4'],
    backgroundColor: theme['background-basic-color-4'],
  },
}));