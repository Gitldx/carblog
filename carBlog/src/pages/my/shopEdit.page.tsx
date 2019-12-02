import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Platform, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, Tab, TabView, Text, TabBar, List, OverflowMenu, OverflowMenuItemType, ListItem, } from 'react-native-ui-kitten';

import { PageView } from '../pageView';
import { Input, ScrollableAvoidKeyboard, ButtonBar } from '@src/components/common';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { ImageSource } from '@src/assets/images';
import { LocalImage } from '@src/assets/images/type';
import { MaterialCommunityIcons, DoneAllIconOutline, MoreVerticalIconFill, MoreHorizontalIconFill } from '@src/assets/icons';
import { PopoverPlacements } from 'react-native-ui-kitten/ui/popover/type';
import { PopupMenu, ListItemPopupMenu } from '@src/components';
import { RestfulJson, getService, shopGetUrl, shopGetByUid, postService, shopEditUrl, productListUrl, productOpenUrl, productCloseUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Shop, Product } from '@src/core/model';



type Props = ThemedComponentProps & NavigationScreenProps

interface imageItem {
  imgLocalFileSource?: ImageSource, imgPath?: string, imgRatio?: number,
  type: "img" | "add"
}

type State = {
  imgLocalFileSource: ImageSource, imgPath: string, imgRatio: number,
  slogan: string, products: Product[]
}

class ShopEdit extends React.Component<Props, State> {  //todo:店铺和商品的服务开通接口


  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '设置店铺'
    }
  }


  public state: State = {
    imgLocalFileSource: null,
    imgPath: '',
    imgRatio: 1,
    slogan: '',
    products: []
  }

  private shop: Shop = null

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
        <Text appearance="hint">点击设置店铺logo</Text>
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


  private addProduct = () => {
    this.props.navigation.navigate("myProduct", { saveHandler: this.refreshProductList })
  }

  private refreshProductList = async () => {
    const rj = await getService(productListUrl(UserAccount.getUid())) as RestfulJson
    const products: Product[] = rj.data
    this.setState({ products })
  }


  private edit = (product: Product) => {
    this.props.navigation.navigate("myProduct", { product, saveHandler: this.refreshProductList })
  }


  private pay = () => {
    this.props.navigation.navigate("Pay")
  }


  // renderImages = (info : ListRenderItemInfo<imageItem>)=>{

  //   return ( 
  //      info.item.type == "add"  ? this.renderEmptyImg(true) : this.renderSelectedImg()
  //   )
  // }



  private items: OverflowMenuItemType[] = [
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

  private onMenuItemSelect = (index: number, product: Product) => {
    switch (index) {
      case 0:

        break;
      case 1:
        this.openProduct(product.id)
        break;
      case 2:
        this.closeProduct(product.id)
        break;
    }
  }

  private async openProduct(id: string) {
    const rj = await postService(productOpenUrl(id), null) as RestfulJson
    if (rj.ok) {
      this.refreshProductList()
    }
  }


  private async closeProduct(id: string) {
    const rj = await postService(productCloseUrl(id), null) as RestfulJson
    if (rj.ok) {
      this.refreshProductList()
    }
  }


  private save = async () => {
    const data = { id: this.shop ? this.shop.id : null, uid: UserAccount.getUid(), slogan: this.state.slogan }
    const rj = await postService(shopEditUrl(), data) as RestfulJson
    this.shop = { id: rj.data, uid: UserAccount.getUid(), slogan: this.state.slogan } as any
  }

  private renderMenuItems(product: Product): OverflowMenuItemType[] {
    const item1: OverflowMenuItemType = { title: '开通商品展示' }
    const item2: OverflowMenuItemType = { title: '上架' }
    const item3: OverflowMenuItemType = { title: '下架' }
    const item4: OverflowMenuItemType = { title: "删除" }

    if (product.openService) {
      item1.disabled = true
    }
    if (product.open) {
      item2.disabled = true
    }
    else {
      item3.disabled = true
    }

    return [item1, item2, item3, item4]
  }


  private renderActions = (product: Product) => {
    const items = this.renderMenuItems(product)
    return (
      <ListItemPopupMenu data={product} onItemSelect={this.onMenuItemSelect} items={items} iconColor="success" orientaion="horizontal" placement={PopoverPlacements.LEFT_END} />
    )
  }


  public async componentWillMount() {
    const rj: RestfulJson = await getService(shopGetByUid(UserAccount.getUid())) as any
    const shop: Shop = rj.data
    const rj2 = await getService(productListUrl(UserAccount.getUid())) as RestfulJson
    const products: Product[] = rj2.data
    // console.warn(JSON.stringify(shop))
    if (shop) {
      this.shop = shop
      this.setState({ slogan: shop.slogan, products })
    }
  }


  private renderItem = (info: ListRenderItemInfo<Product>) => {
    const { themedStyle } = this.props
    return (
      // <ButtonBar leftText="今天天气不错" onPress={this.edit} rightKit={this.renderActions}/>
      <ListItem style={themedStyle.listItem} onPress={() => this.edit(info.item)}>
        <Text appearance="hint">{info.item.productName}</Text>
        {this.renderActions(info.item)}
      </ListItem>
    )
  }


  public render(): React.ReactNode {
    const { themedStyle } = this.props
    return (
      <ScrollableAvoidKeyboard style={themedStyle.container} extraScrollHeight={this.keyboardOffset}>

        <Button onPress={this.pay} status="success" style={{ marginVertical: 20 }}>开通店铺展示服务</Button>

        {
          this.state.imgLocalFileSource == null ? this.renderEmptyImg() : this.renderSelectedImg()
        }
        {/* <Input label="店铺名称" placeholder="请填写商品名称" /> */}
        <Input label="店铺标语" placeholder="简单的一两句话介绍店铺情况" value={this.state.slogan} onChangeText={val => this.setState({ slogan: val })} />

        <View style={{ flex: 1, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>商品列表</Text>
            <TouchableOpacity style={themedStyle.addbutton} onPress={this.addProduct}>
              <MaterialCommunityIcons name="plus" color="white" />
            </TouchableOpacity>
          </View>
          <List data={this.state.products} renderItem={this.renderItem} style={themedStyle.listContainer} />
        </View>

        <Button status="success" style={{ marginTop: 100 }} onPress={this.save} >保存</Button>

        {/* {this.renderActions()} */}
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
  menuContainer: {
    width: 228,
  }
})


export const ShopEditPage = withStyles(ShopEdit, (theme: ThemeType) => ({
  container: {
    flex: 1,
    paddingHorizontal: 10
    // backgroundColor: theme['background-basic-color-1'],
  },
  addbutton: {
    backgroundColor: theme['color-success-400'],
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center'
  },
  listContainer: {
    flex: 1,
    backgroundColor: theme['background-basic-color-1'],
  },
  listItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme['border-basic-color-3'],
  }
}));