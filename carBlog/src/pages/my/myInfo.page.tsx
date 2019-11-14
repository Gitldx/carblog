import React from 'react';
import { View, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout, List, Radio, ButtonProps } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar, ScrollableAvoidKeyboard } from '@src/components/common';
import { ThemeContext, ThemeContextType } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { PageView } from '../pageView';
import { InputSetting } from '@src/components';
import { AccountRoleType } from '@src/core/userAccount/type';
import { ProfilePhoto } from './profilePhoto.component'
import { CameraIconFill, PersonIconFill, PersonImage } from '@src/assets/icons';
import { author1 } from '@src/core/data/articles';
import { postService, setUserInfoUrl, RestfulJson, RestfulResult, getService, getUserAccountUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';




interface State {
  role: AccountRoleType,
  nickname: string,
  carNumber: string,
  phone: string
}


type Props = ThemedComponentProps & NavigationScreenProps

export class MyInfo extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '用户信息'
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
    const rj: RestfulJson = await postService(setUserInfoUrl(), { id:UserAccount.getUid(),...this.state }) as any
    if(rj.ok){
      UserAccount.instance.setInfo({...this.state})
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


  public async componentWillMount(){

    const rj : RestfulJson = await getService(getUserAccountUrl(UserAccount.getUid())) as any

    const ua : UserAccount = rj.data;

    this.setState({role:ua.role,nickname:ua.nickname,carNumber:ua.carNumber,phone:ua.phone})

  }

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    const { role, nickname, carNumber, phone } = this.state
    return (
      <ScrollableAvoidKeyboard style={themedStyle.container}>

        <View style={themedStyle.photoSection}>
          <ProfilePhoto
            style={themedStyle.photo}
            source={PersonImage.imageSource}
            // source = {author1.photo.imageSource}
            button={this.renderPhotoButton}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingVertical: 15 }}>
          <Radio status="success"
            text="我有车"
            checked={role == 1}
            onChange={() => this.onRadioChecked(1)}
          />
          <Radio status="success"
            text="我没车"
            checked={role == 2}
            onChange={() => this.onRadioChecked(2)}
          />
        </View>

        <InputSetting hint="昵称" value={nickname} onChangeText={val => this.setState({ nickname: val })} />
        <InputSetting hint="车牌号" value={carNumber} onChangeText={val => this.setState({ carNumber: val })} />
        <InputSetting hint="手机号" value={phone} onChangeText={val => this.setState({ phone: val })} />

        <View style={{ padding: 15 }}>
          <Button onPress={this.save}>保存</Button>
        </View>

      </ScrollableAvoidKeyboard>
    );
  }
}


export const MyInfoPage = withStyles(MyInfo, (theme: ThemeType) => ({
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