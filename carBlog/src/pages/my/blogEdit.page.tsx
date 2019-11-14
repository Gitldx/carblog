import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ListRenderItemInfo } from 'react-native'
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
import { LocalImage } from '@src/assets/images/type';
import { MaterialCommunityIcons } from '@src/assets/icons';
import { blogList, author1, articles } from '@src/core/data/articles';
import { RestfulJson, postService, writeArticleUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Article } from '@src/core/model';



type Props = ThemedComponentProps & NavigationScreenProps

type State = {
  imgLocalFileSource: ImageSource, imgPath: string, imgRatio: number,
  title : string,content:string
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
    imgLocalFileSource: null,
    imgPath: '',
    imgRatio: 1,
    title : "",
    content : ""
    
  }


  private article : Article 
  private saveHandler : (article : Article)=>void

  private keyboardOffset: number = Platform.select({
    ios: 40,
    android: 30,
  });


  private imgWidth = 0
  private imgHeight = 0
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
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source: ImageSource = new LocalImage(response.uri) //{ uri: response.uri };

        // console.warn(`filesize:${response.fileSize}`)
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        //console.warn(source.uri)
        this.imgWidth = response.width
        this.imgHeight = response.height
        this.setState({
          imgLocalFileSource: source,
          imgPath: (source.imageSource as any).uri,
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
    return (
      <TouchableOpacity style={{ marginBottom: 10, padding: 10 }}
        onPress={this.pickImage}>
        <Image resizeMode='stretch'
          style={{
            // width: this.state.imgWidth,
            aspectRatio: this.state.imgRatio
            //height: this.state.imgHeight,
          }}
          source={this.state.imgLocalFileSource.imageSource}
        // onLoadStart={(e) => this.setState({spinner: true})}
        // onLoadEnd={(e) => this.setState({spinner: false})}
        />
      </TouchableOpacity>

    )
  }


  private save = async ()=>{
    const rj : RestfulJson = await postService(writeArticleUrl(),
    {id:this.article? this.article.id:null,uid:UserAccount.getUid(),title: this.state.title,content:this.state.content}) as any
    console.warn(JSON.stringify(rj))
    
    this.article = Object.assign({},{id:rj.data,title:this.state.title,content:this.state.content}) as any

    if(this.saveHandler){
      this.saveHandler(this.article);
    }
  }



  public componentDidMount(){
    this.props.navigation.setParams({preview:()=>{
      this.props.navigation.navigate("ArticlePreview",{article:{title:this.state.title,content:this.state.content,image:articles[0].image}})
    }})

    this.article = this.props.navigation.getParam("article")
    this.saveHandler = this.props.navigation.getParam("saveHandler")
    if(this.article){
      const {title,content} = this.article;
      this.setState({title,content})
    }

  }


  public render(): React.ReactNode {
    const { themedStyle } = this.props
    const {title,content} = this.state
    return (
      <ScrollableAvoidKeyboard style={themedStyle.container} extraScrollHeight={this.keyboardOffset}>
        {
          this.state.imgLocalFileSource == null ? this.renderEmptyImg() : this.renderSelectedImg()
        }
        <Input label="标题" placeholder="..." value={title} onChangeText={val=>this.setState({title:val})}/>
        <Input label="正文" placeholder="..." multiline={true} value={content} onChangeText={val=>this.setState({content:val})}/>


        <Button status="success" style={{ marginTop: 100 }} onPress={this.save}>保存</Button>


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