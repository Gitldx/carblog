import React from 'react';
import { View, ListRenderItemInfo, StyleSheet, Text } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, withStyles, ThemeType, Text as RKText, ThemedComponentProps, Layout, List, Radio, ButtonProps, Tooltip } from 'react-native-ui-kitten';
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
import { getService, getUserAccountUrl, getProfileUrl, rj } from '@src/core/uitls/httpService';
import { withErrorBoundary } from '@src/core/uitls/exceptionCatcher';
import { UserAccount } from '@src/core/userAccount/userAccount';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { gamerule1, gamerule2, gamerule3_1, gamerule3_2, scoreHint1, scoreHInt2 } from '@src/core/uitls/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';



interface State {
  parkMoney: number
  totolGiftMoney: number
  totalProducedMoney: number
  tooltipVisible1 : boolean
  tooltipVisible2 : boolean
}


type Props = ThemedComponentProps & NavigationScreenProps

export class MyScore extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '积分，游戏规则'
    }
  }

  public state: State = {
    totalProducedMoney: 0,
    totolGiftMoney: 0,
    parkMoney: 0,
    tooltipVisible1 : false,
    tooltipVisible2 : false
  }




  public async componentWillMount() {

    const s = onlineAccountState()
    if (s == 0) {
      return;
    }

    const rr = await getService(getProfileUrl(UserAccount.getUid()))

    const ua: UserAccount = rj(rr).data;
    // console.warn(JSON.stringify(ua))
    this.setState({ totolGiftMoney: ua.totalGiftMoney, totalProducedMoney: ua.totalProducedMoney, parkMoney: ua.parkMoney })

  }

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    const { parkMoney, totolGiftMoney, totalProducedMoney } = this.state
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
          <Text style={[styles.balanceText, { color: 'gold' }]}>{parkMoney}</Text>
        </View>
        <View style={styles.blanceRow}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="medal" size={18} color="green" />
            <RKText>累计生产车位币</RKText>
            <Tooltip textStyle={{ fontSize: 12 }} text={scoreHint1} placement="right" style={{ width: 200 }}
              visible={this.state.tooltipVisible1} onBackdropPress={() => this.setState({ tooltipVisible1: false })}>
              <TouchableOpacity onPress={() => this.setState({ tooltipVisible1: true })}>
                <MaterialCommunityIcons name="help-circle" size={18} color={getThemeValue("color-warning-default", themes['App Theme'])} />
              </TouchableOpacity>
            </Tooltip>
          </View>
          <Text style={[styles.balanceText, { color: 'green' }]}>{totalProducedMoney}</Text>
        </View>
        <View style={styles.blanceRow}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="medal" size={18} color="red" />
            <RKText>已赠送车位币</RKText>
            <Tooltip textStyle={{ fontSize: 12 }} text={scoreHInt2} placement="right" style={{ width: 220 }}
              visible={this.state.tooltipVisible2} onBackdropPress={() => this.setState({ tooltipVisible2: false })}>
              <TouchableOpacity onPress={() => this.setState({ tooltipVisible2: true })}>
                <MaterialCommunityIcons name="help-circle" size={18} color={getThemeValue("color-warning-default", themes['App Theme'])} />
              </TouchableOpacity>
            </Tooltip>
          </View>
          <Text style={[styles.balanceText, { color: 'red' }]}>{totolGiftMoney}</Text>
        </View>

        <View style={{ paddingHorizontal: 5, marginTop: 10 }}>
          <RKText appearance="hint" category="h6" style={{ textAlign: 'center' }}>车位币规则</RKText>
          <RKText appearance="hint" category="s1">
            车位币的用途
        </RKText>
          <RKText appearance="hint" category="p2">
            {gamerule1}
          </RKText>
          <RKText appearance="hint" category="s1" style={{ marginTop: 5 }}>
            如何自己生产车位币
        </RKText>
          <RKText appearance="hint" category="p2">
            {gamerule2}
          </RKText>
          <RKText appearance="hint" category="s1" style={{ marginTop: 5 }}>
            如何帮其他车主生产车位币
        </RKText>
          <RKText appearance="hint" category="p2">
            {gamerule3_1}
            <RKText style={{ color: getThemeValue("color-warning-default", themes["App Theme"]) }} category="p2">
              {gamerule3_2}
            </RKText>
          </RKText>
        </View>


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