import React from 'react';
import { View, ListRenderItemInfo, Modal } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout, List, Radio, ButtonProps } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar, ScrollableAvoidKeyboard, Input } from '@src/components/common';
import { ThemeContext, ThemeContextType } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { PageView } from '../pageView';
import { InputSetting } from '@src/components';
import { AccountRoleType } from '@src/core/userAccount/type';
import { ProfilePhoto } from './profilePhoto.component'
import { CameraIconFill, PersonIconFill, PersonImage } from '@src/assets/icons';
import { author1 } from '@src/core/data/articles';
import { postService, setUserInfoUrl, RestfulJson, RestfulResult } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { isEmpty, toDate } from '@src/core/uitls/common';
import FlashMessage,{showMessage,hideMessage} from 'react-native-flash-message'



interface State {
  month: number,
  endMonth: string,
  totalPrice: number
}


type Props = ThemedComponentProps & NavigationScreenProps

export class Pay extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '开通服务'
    }
  }


  unitPrice = 3

  public state: State = {
    month: undefined,
    endMonth: undefined,
    totalPrice: 0
  }



  private edit = () => {
    this.props.navigation.navigate("myBlog")
  }


  private testShow =()=>{
    showMessage({
      position:{ top: 160, left: 30, right: 30 } as any,
      message : '呵呵',
      floating:true,
      onPress :hideMessage,
      autoHide:false,
      backgroundColor :'rgba(0,0,0,0.1)'
    })
  }


  private onChangeMonth = (val: string) => {
    if (isEmpty(val) || Number(val)<=0) {
      this.setState({ month: undefined, totalPrice: undefined, endMonth: undefined })
    }
    else {
      let totalPrice = this.unitPrice * Number(val)
      const today = new Date()
      const dateOfToday = today.getDate()
      if (dateOfToday >= 15) {
        totalPrice -= this.unitPrice/2
      }
      today.setMonth(today.getMonth() + Number(val))
      today.setDate(1)
      const nextTime = today.setDate(today.getDate() - 1)


      this.setState({ month: Number(val), totalPrice, endMonth: toDate(nextTime, "YYYY-MM-dd") })
    }

  }


  public render(): React.ReactNode {

    const { themedStyle } = this.props
    const { } = this.state
    return (
      <ScrollableAvoidKeyboard style={themedStyle.container}>

        <Text category="p2" appearance="hint" style={{ paddingHorizontal: 15 }}>
          开通后，您停车的时候将把店铺展示在首页；请到首页的停车操作中选择是否展示商品（右上角按钮）
      </Text>

        <Text category="p2" appearance="hint" style={{ paddingHorizontal: 15, marginVertical: 10 }}>
          每月3元，本月剩余时间不足半月按半个月算，不足一个月按一个月算
      </Text>


        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
          <Input keyboardType="number-pad" textStyle={{ textAlign: 'right' }} style={{ width: 100 }} placeholder="使用时长"
            onChangeText={this.onChangeMonth}
          />
          <Text>月</Text>
          <Text style={{ marginLeft: 5 }}>{"服务截止时间：" + (isEmpty(this.state.endMonth) ? "" : this.state.endMonth)}</Text>
        </View>

        {/* <InputSetting hint="昵称" value={nickname} onChangeText={val=>this.setState({nickname:val})}/>
         <InputSetting hint="车牌号" value={carNumber} onChangeText={val=>this.setState({carNumber:val})}/>
         <InputSetting hint="手机号" value={phone} onChangeText={val=>this.setState({phone:val})}/> */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 5 }}>
          <Text>总金额：</Text>
          <Text status="danger">{this.state.totalPrice == undefined ? "0" : this.state.totalPrice.toString()}</Text>
          <Text>元</Text>
        </View>
        <View style={{ padding: 15 }}>
          <Button onPress={this.testShow}>支付</Button>
        </View>

        <FlashMessage ref="fmLocalInstance" position="bottom" animated={true} autoHide={false} />
      </ScrollableAvoidKeyboard>
    );
  }
}


export const PayPage = withStyles(Pay, (theme: ThemeType) => ({
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