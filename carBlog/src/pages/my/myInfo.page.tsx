import React from 'react';
import { View, ListRenderItemInfo, ImageStore, NativeModules, ImageSourcePropType } from 'react-native'
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
import { postService, setUserInfoUrl, RestfulJson, RestfulResult, getService, getUserAccountUrl, getQiniuTokenUrl, qiniuImgUrl, rrnol, rj } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import ImagePicker from 'react-native-image-picker';
import { ImageSource } from '@src/assets/images';
import { LocalImage, RemoteImage } from '@src/assets/images/type';
import { toDate, isEmpty } from '@src/core/uitls/common';
import { simpleAlert } from '@src/core/uitls/alertActions';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import Spinner from 'react-native-loading-spinner-overlay';
import debounce from '@src/core/uitls/debounce'

const NativeAPI = NativeModules.NativeAPI

interface State {
  role: AccountRoleType,
  nickname: string,
  carNumber: string,
  phone: string,
  imgLocalFileSource: ImageSource, imgPath: string,
  spinner: boolean
}


type Props = ThemedComponentProps & NavigationScreenProps

export class MyInfo extends React.Component<Props, State> {//todo:发表文章，聊天前，如果尚未完善信息，提示用户过来完善信息

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '用户信息'
    }
  }

  public state: State = {
    role: 1,
    nickname: `用户${toDate(new Date(),"yyMMddhhmmss")}`,
    carNumber: "",
    phone: "",
    imgLocalFileSource: null,
    imgPath: '',
    spinner: false
  }




  private uploadImg = async () => {

    const { imgPath } = this.state
    if (imgPath.startsWith("file://")) {
      const uriStr = this.state.imgPath.replace('file://', '')

      const now = Date.now()
      const qiniuKey = toDate(now, 'yyyyMMdd') + "/" + UserAccount.getUid() + "_" + now
      const res = await getService(getQiniuTokenUrl(qiniuKey))
      if(rrnol(res)){
        return { uploadResult: -1, qiniuKey: null }
      }
      const token = rj(res).data
      // console.warn(`token:${token}`)
      const uploadResult = await NativeAPI.uploadImgQiniu(uriStr, token, qiniuKey)

      return { uploadResult, qiniuKey }
    }
    else {
      return { uploadResult: 1, qiniuKey: null }
    }


  }


  private save = debounce(()=>{
    this.saveAction()
  },5000,true)


  private saveAction = async () => {

    if(isEmpty(this.state.nickname)){
      simpleAlert(null,"请填写昵称")
      return;
    }

    this.setState({ spinner: true })

    const { uploadResult, qiniuKey } = await this.uploadImg()

    // console.warn(`result:${uploadResult}`)
    if (uploadResult == 1) {
      const { carNumber, nickname, role, phone, imgPath } = this.state
      const image = qiniuKey ? qiniuKey : imgPath
      const reqData = { id: UserAccount.getUid(), carNumber, role, nickname, phone, image }
      // return;
      const toDeleteImg = this.serverUserInfo.image != image ? this.serverUserInfo.image : ""
      const rr = await postService(setUserInfoUrl(toDeleteImg), reqData)
      if (rj(rr).ok) {
        this.setState({ spinner: false }, () => {
          UserAccount.instance.setInfo({ ...this.state })
          setTimeout(() => {
            if(this.state.role != this.serverUserInfo.role){
              simpleAlert(null, "更改身份类型后需重启App生效", "知道了", () => {
                NativeAPI.exitApp()
              })
            }
            else{
              simpleAlert(null, "保存成功", null, () => {
                this.props.navigation.goBack(KEY_NAVIGATION_BACK)
              })
            }
            
          }, 500)

        })


      }
    }
    else if(uploadResult == 0) {
      this.setState({ spinner: false }, () => {
        setTimeout(() => {
          simpleAlert(null, "系统出了点问题，请稍后再试")
        }, 500)

      })

    }
    else if(uploadResult ==-1){

    }


  }


  private onRadioChecked = (value: AccountRoleType) => {
    this.setState({ role: value })
  }

  
  private pickImage = () => {
    const options = {
      //title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
      title: '选择照片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册中选择'
    };



    ImagePicker.showImagePicker(options, (response) => {



      console.log('Response = ', response);

      if (response.didCancel) {

      } else if (response.error) {

      } else if (response.customButton) {

      } else {
        // const source: ImageSource = new LocalImage(response.uri) //{ uri: response.uri };


        // if(!isEmpty(this.state.imgPath) && !this.state.imgPath.startsWith("file://")){
        //   this.previousRemoteImgPath = this.state.imgPath
        // }

        this.setState({
          // imgLocalFileSource: source,
          imgPath: response.uri//(source.imageSource as any).uri,
        });

        // Image.getSize(source, (width, height) => {
        //     this.setState({
        //         imgPath: source,
        //         //imgWidth:width,
        //         imgRatio: width / height
        //     });
        // })


      }
    });

  }

  private renderPhotoButton = (): React.ReactElement<ButtonProps> => {
    const { themedStyle } = this.props;

    return (
      <Button
        style={themedStyle.photoButton}
        activeOpacity={0.95}
        icon={CameraIconFill}
        onPress={this.pickImage}
      />
    );
  };

  // private previousRemoteImgPath = undefined
  private serverUserInfo : UserAccount = null
  public async componentWillMount() {

    const rr = await getService(getUserAccountUrl(UserAccount.getUid()))
    if(rrnol(rr)){
      return
    }

    const ua: UserAccount = rj(rr).data;

    this.serverUserInfo = ua

    this.setState({ role: ua.role, nickname: ua.nickname, carNumber: ua.carNumber, phone: ua.phone, imgPath: ua.image as string })

  }

  private testImage = new RemoteImage("http://q1opwedmp.bkt.clouddn.com/20191130/5db116f1eb819b0a0eba3cd6_1575120008450")
  //new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg")

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    const { role, nickname, carNumber, phone, imgLocalFileSource, imgPath } = this.state
    let image: ImageSourcePropType = PersonImage.imageSource
    let style = { tintColor: 'lightgrey' }
    // if(imgLocalFileSource){
    //   image = imgLocalFileSource.imageSource
    //   style = null
    // }
    // else if(!isEmpty(imgPath)){
    //   const path = qiniuImgUrl(imgPath)
    //   image = new RemoteImage(path).imageSource
    //   style = null
    // }
    if (!isEmpty(imgPath)) {
      if (!imgPath.startsWith("file://")) {
        const path = qiniuImgUrl(imgPath)
        image = new RemoteImage(path).imageSource
      }
      else {
        image = new LocalImage(imgPath).imageSource
      }

      style = null
    }

    return (
      <ScrollableAvoidKeyboard style={themedStyle.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'正在上传...'}
          textStyle={{ color: 'white' }}
        />
        <View style={themedStyle.photoSection}>
          <ProfilePhoto
            style={[themedStyle.photo, style]}
            // source={imgLocalFileSource ? imgLocalFileSource.imageSource : PersonImage.imageSource}
            source={image}
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
        <InputSetting hint="车牌号" value={carNumber} onChangeText={val => this.setState({ carNumber: val.toUpperCase() })} />
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