import React from 'react';
import { NativeModules, View, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ListRenderItemInfo, ImageSourcePropType } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, List, } from 'react-native-ui-kitten';

import { PageView } from '../pageView';
import { Input, ScrollableAvoidKeyboard } from '@src/components/common';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { ImageSource } from '@src/assets/images';
import { LocalImage, RemoteImage } from '@src/assets/images/type';
import { MaterialCommunityIcons } from '@src/assets/icons';
import { blogList, author1, articles } from '@src/core/data/articles';
import { RestfulJson, postService, writeArticleUrl, qiniuImgUrl, getService, getQiniuTokenUrl, rrnol, rj, RestfulResult, updateArticleUrl, deleteService, deleteArticleUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Article } from '@src/core/model';
import { isEmpty, toDate, showNoNetworkAlert } from '@src/core/uitls/common';
import { simpleAlert, towActionAlert } from '@src/core/uitls/alertActions';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import Spinner from 'react-native-loading-spinner-overlay';
import debounce from '@src/core/uitls/debounce'


const NativeAPI = NativeModules.NativeAPI


type Props = ThemedComponentProps & NavigationScreenProps

type State = {
  /* imgLocalFileSource: ImageSource, */ imgPath: string, imgRatio: number,
  title: string, content: string, spinner: boolean
}

class BlogEdit extends React.Component<Props, State> {


  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {

    const rightControls = <TouchableOpacity onPress={navigation.getParam("preview")}>
      <Text>预览</Text>
    </TouchableOpacity>

    return {
      title: '写文章',
      rightControls

    }
  }



  public state: State = {
    // imgLocalFileSource: null,
    imgPath: '',
    imgRatio: 1,
    title: "",
    content: "",
    spinner: false
  }


  private article: Article
  private saveHandler: (article: Article) => void
  private deleteHandler : ()=>void
  private keyboardOffset: number = Platform.select({
    ios: 40,
    android: 30,
  });


  // private imgWidth = 0
  // private imgHeight = 0
  private pickImage = () => {
    const options = {
      //title: 'Select Avatar',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.5,
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

        // console.warn(`filesize:${response.fileSize}`)
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        //console.warn(source.uri)
        // this.imgWidth = response.width
        // this.imgHeight = response.height
        this.setState({
          // imgLocalFileSource: source,
          imgPath: response.uri,//(source.imageSource as any).uri,
          imgRatio: response.width / response.height,

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


  // addImage = ()=>{
  //   const copy = Object.assign([],this.state.images)
  //   copy.splice(copy.length-1,0,{
  //     imgLocalFileSource: this.state.imgLocalFileSource,
  //     imgPath: this.state.imgPath,
  //     imgRatio: this.state.imgRatio})

  //   this.setState({images:copy})
  // }


  private renderEmptyImg() {

    return (
      <TouchableOpacity onPress={this.pickImage} style={styles.emptyImgbox}>
        <Icon name='plus' size={50} color={"lightgrey"} />
        <Text appearance="hint">设置相片</Text>
      </TouchableOpacity>
    )
  }


  private renderSelectedImg() {

    const { imgPath, imgRatio } = this.state

    let image: ImageSourcePropType
    if (!imgPath.startsWith("file://")) {
      const path = qiniuImgUrl(imgPath)
      image = new RemoteImage(path).imageSource
    }
    else {
      image = new LocalImage(imgPath).imageSource
    }

    return (
      <TouchableOpacity style={{ marginBottom: 10, padding: 10 }}
        onPress={this.pickImage}>
        <Image resizeMode='stretch'
          style={{
            // width: this.state.imgWidth,
            aspectRatio: imgRatio
            //height: this.state.imgHeight,
          }}
          source={image}
        // onLoadStart={(e) => this.setState({spinner: true})}
        // onLoadEnd={(e) => this.setState({spinner: false})}
        />
      </TouchableOpacity>

    )
  }


  private uploadImg = async () => {//todo:上传图片似乎容易出错，调试一下

    const { imgPath } = this.state
    if (imgPath.startsWith("file://")) {
      const uriStr = this.state.imgPath.replace('file://', '')

      const now = Date.now()
      const qiniuKey = toDate(now, 'yyyyMMdd') + "/" + UserAccount.getUid() + "_" + now
      const res = await getService(getQiniuTokenUrl(qiniuKey))
      if (rrnol(res)) {
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
  },3000,true)


  private saveAction = async () => {

    if(isEmpty(this.state.title || this.state.content)){
      simpleAlert(null,"请填写标题和文章内容")
      return
    }

    this.setState({ spinner: true })

    const { uploadResult, qiniuKey } = await this.uploadImg()

    if (uploadResult == 1) {

      const { title, content, imgPath, imgRatio } = this.state
      const image = qiniuKey ? qiniuKey : imgPath
      const reqData = { id: this.article ? this.article.id : null, uid: UserAccount.getUid(), title, content, image, imgRatio }

      let rr: RestfulResult
      if (!this.article) {
        rr = await postService(writeArticleUrl(), reqData)
      }
      else {
        const toDeleteImg = this.article.image != image ? this.article.image : ""
        rr = await postService(updateArticleUrl(toDeleteImg), { ...reqData, date: this.article.date })
      }

      if (rj(rr).ok) {
        this.article = Object.assign({}, {
          id: rj(rr).data, title: this.state.title, content: this.state.content, image: image,
          imgRatio: this.state.imgRatio
        }) as any
        this.state.imgPath = image
        if (this.saveHandler) {
          this.saveHandler(this.article);
        }
        this.setState({ spinner: false }, () => {
          setTimeout(() => {
            simpleAlert(null, "保存成功", null, () => {
              // this.props.navigation.goBack(KEY_NAVIGATION_BACK)
            })
          }, 500)
        })

      }
      else{
        this.setState({spinner:false})
      }

    }
    else if (uploadResult == 0) {
      this.setState({ spinner: false }, () => {
        setTimeout(() => {
          simpleAlert(null, "系统出了点问题，请稍后再试")
        }, 500)

      })

    }
    else if (uploadResult == -1) {

    }




  }


  private delete = () => { //todo:服务器删除图片
    towActionAlert("提示", "确认删除", "取消", null, "删除", async () => {

      const rr = await deleteService(deleteArticleUrl(this.article.id), null)
      if (rrnol(rr)) {
        showNoNetworkAlert()
        return;
      }

      this.deleteHandler()

      simpleAlert(null, "删除成功", "关闭", () => {
        this.props.navigation.goBack(KEY_NAVIGATION_BACK)
      })

    })

  }

  private preview = () => {

    let image = null
    if (!isEmpty(this.state.imgPath)) {
      if (this.state.imgPath.startsWith("file://")) {
        image = new LocalImage(this.state.imgPath)
      }
      else {
        image = new RemoteImage(qiniuImgUrl(this.state.imgPath))
      }
    }

    const data: Article = {
      title: this.state.title, content: this.state.content,
      image: image ? this.state.imgPath : null, imgRatio: this.state.imgRatio
    } as any

    this.props.navigation.navigate("ArticlePreview", { article: data })
  }



  public componentWillMount() {
    this.props.navigation.setParams({
      preview: this.preview
    })

    this.article = this.props.navigation.getParam("article")
    this.saveHandler = this.props.navigation.getParam("saveHandler")
    this.deleteHandler = this.props.navigation.getParam("deleteHandler")
    if (this.article) {
      const { title, content, image, imgRatio } = this.article;
      this.setState({ title, content, imgPath: image as string, imgRatio: imgRatio ? imgRatio : 1 })
    }

  }


  public render(): React.ReactNode {
    const { themedStyle } = this.props
    const { title, content } = this.state
    return (
      <ScrollableAvoidKeyboard style={themedStyle.container} extraScrollHeight={this.keyboardOffset}>
        <Spinner
          visible={this.state.spinner}
          textContent={'正在上传...'}
          textStyle={{ color: 'white' }}
        />
        {
          isEmpty(this.state.imgPath) ? this.renderEmptyImg() : this.renderSelectedImg()
        }
        <Input label="标题" placeholder="..." value={title} onChangeText={val => this.setState({ title: val })} />
        <Input label="正文" placeholder="..." multiline={true} value={content} onChangeText={val => this.setState({ content: val })} />


        <Button status="success" style={{ marginTop: 100 ,marginBottom: 20,}} onPress={this.save}>保存</Button>

        {
          this.article && this.article.id &&
          <Button status="danger" style={{ marginBottom: 50 }} onPress={this.delete}>删除</Button>

        }


      </ScrollableAvoidKeyboard>

    );
  }


}


const styles = StyleSheet.create({
  emptyImgbox: {
    alignSelf: 'center', justifyContent: 'center', padding: 10,
    alignItems: 'center', width: "100%", height: 100, borderWidth: 1,
    borderColor: "lightgrey", borderStyle: 'dotted', marginBottom: 10
  },
})


export const BlogEditPage = withStyles(BlogEdit, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10
    // backgroundColor: theme['background-basic-color-1'],
  },
  addbutton: {
    backgroundColor: theme['color-success-400'],
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center'
  }
}));