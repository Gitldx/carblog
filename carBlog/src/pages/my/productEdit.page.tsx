import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, List, TopNavigation, TopNavigationAction, OverflowMenuItemType, } from 'react-native-ui-kitten';

import { PageView } from '../pageView';
import { Input, ScrollableAvoidKeyboard } from '@src/components/common';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { ImageSource } from '@src/assets/images';
import { LocalImage } from '@src/assets/images/type';
import { NavigationActions } from 'react-navigation';
import { ArrowIosBackFill, MoreVerticalIconFill } from '@src/assets/icons';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { PopupMenu } from '@src/components';
import { PopoverPlacements } from 'react-native-ui-kitten/ui/popover/type';
import { Product } from '@src/core/model';
import { listArticleUrl, postService, productListUrl, productEditUrl, RestfulJson } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';



type Props = ThemedComponentProps & NavigationScreenProps

interface imageItem {
  imgLocalFileSource?: ImageSource, imgPath?: string, imgRatio?: number,
  type: "img" | "add"
}

type State = {
  imgLocalFileSource: ImageSource, imgPath: string, imgRatio: number,
  name: string, slogan: string, price: string, desription: string,
  images: imageItem[]
}

class ProductEdit extends React.Component<Props, State> {


  // static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
  //   return {
  //     title: '编辑商品'
  //   }
  // }

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const lett = <TopNavigationAction icon={ArrowIosBackFill} onPress={() => navigation.goBack(KEY_NAVIGATION_BACK)} />

    const items: OverflowMenuItemType[] = [
      {
        title: '开通商品展示',
      },
      {
        title: '上架',
      },
      {
        title: '下架',
        disabled: true
      },
      {
        title: "删除"
      }
    ];

    const onMenuItemSelect = (index) => {
      console.warn(index)
    }

    const right = () => {
      return ([
        // <TopNavigationAction icon={MoreVerticalIconFill}/>
        <PopupMenu items={items} onItemSelect={onMenuItemSelect} />
      ])
    }
    const header = <TopNavigation style={{ height: 56 }} alignment="center" title="编辑商品" leftControl={lett} rightControls={right()} />
    return {
      header
    }
  }


  public state: State = {
    imgLocalFileSource: null,
    imgPath: '',
    imgRatio: 1,
    name: "",
    slogan: "",
    price: "",
    desription: '',
    images: [{ type: "add" }]
  }

  private keyboardOffset: number = Platform.select({
    ios: 40,
    android: 30,
  });


  private product: Product = null
  private saveHandler : ()=>void


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
      quality: 0.5,
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


  private addImage = () => {
    const copy = Object.assign([], this.state.images)
    copy.splice(copy.length - 1, 0, {
      imgLocalFileSource: this.state.imgLocalFileSource,
      imgPath: this.state.imgPath,
      imgRatio: this.state.imgRatio
    })

    this.setState({ images: copy })
  }


  private renderEmptyImg(add: boolean = false) {
    const func = add ? this.addImage : this.pickImage
    return (
      <TouchableOpacity onPress={func} style={styles.emptyImgbox}>
        <Icon name='plus' size={50} color={"lightgrey"} />
        <Text appearance="hint">点击设置商品logo</Text>
      </TouchableOpacity>
    )
  }


  private renderSelectedImg() {
    return (
      <TouchableOpacity style={{ flex: 1, marginBottom: 10, padding: 10 }}
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


  private renderImages = (info: ListRenderItemInfo<imageItem>) => {

    return (
      info.item.type == "add" ? this.renderEmptyImg(true) : this.renderSelectedImg()
    )
  }


  private save = async ()=>{
    const {name,slogan,desription,price} = this.state
    const data = {id:this.product ? this.product.id : null,uid:UserAccount.getUid(),productName : name,productSlogan:slogan,productDescription:desription,price:price}
    const rj = await postService(productEditUrl(),data) as RestfulJson
    const id = rj.data
    console.warn(JSON.stringify(rj))
    this.product = {id,uid:UserAccount.getUid()} as any

    if(this.saveHandler){
      this.saveHandler()
    }

  }


  public componentWillMount(){
    this.saveHandler = this.props.navigation.getParam("saveHandler")
    this.product = this.props.navigation.getParam("product")
    const p = this.product
    if(this.product){
      this.setState({name:p.productName,slogan:p.productSlogan,
        desription:p.productDescription,price:p.price.toString()})
    }

  }


  public render(): React.ReactNode {
    const { themedStyle } = this.props
    const {name,slogan,price,desription} = this.state
    return (
      <ScrollableAvoidKeyboard style={themedStyle.container} extraScrollHeight={this.keyboardOffset}>
        {
          this.state.imgLocalFileSource == null ? this.renderEmptyImg() : this.renderSelectedImg()
        }
        <Input label="商品名称" placeholder="请填写商品名称" value={name} onChangeText={val=>this.setState({name:val})}/>
        <Input label="商品标语" placeholder="简单的一句话介绍商品" value={slogan} onChangeText={val=>this.setState({slogan:val})}/>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <Input value={price} onChangeText={val=>this.setState({price:val})}
           keyboardType="decimal-pad" placeholder="商品价格" style={{ marginRight: 10, textAlign: 'right' }} />
          <Text>元</Text>
        </View>
        <Input value={this.state.desription} onChangeText={val => this.setState({ desription: val })} label="详细介绍" placeholder="详细介绍产品的功能，参数等信息" multiline={true} style={{ height: 100 }} />
        <List numColumns={2} data={this.state.images} renderItem={this.renderImages} />


        <Button status="success" style={{ marginTop: 100 }} onPress={this.save}>保存</Button>


      </ScrollableAvoidKeyboard>

    );
  }


}


const styles = StyleSheet.create({
  emptyImgbox: {
    alignSelf: 'center', flex: 1, justifyContent: 'center', padding: 10,
    alignItems: 'center', width: "100%", height: 100, borderWidth: 1,
    borderColor: "lightgrey", borderStyle: 'dotted', marginBottom: 10
  },
})


export const ProductEditPage = withStyles(ProductEdit, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10
    // backgroundColor: theme['background-basic-color-1'],
  }
}));