import React from 'react';
import {
  ListRenderItemInfo,
  View
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  List,
  ListProps,
  Text
} from 'react-native-ui-kitten/ui';
import { Product } from '@src/core/model';
import {
  ProductListItem,
  ProductListItemProps,
} from './productListItem.component';
import { productList } from '@src/core/data/products';
import { NavigationScreenConfig,NavigationScreenProps } from 'react-navigation';
import { LicensePlate } from '@src/components';
import { getService, productListUrl, RestfulJson } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';

// @ts-ignore (override `renderItem` prop)
interface ComponentProps extends ListProps {
  // onItemAddPress: (index: number) => void;
  // onItemPress: (index: number) => void;
  // renderItem?: (info: ListRenderItemInfo<Product>) => ListItemElement;
}

export type ProductListProps = ThemedComponentProps & ComponentProps & NavigationScreenProps;

type ListItemElement = React.ReactElement<ProductListItemProps>;

type productItemType = Product & {empty?:boolean}

interface State{
  list : Product[]
}

class ProductListComponent extends React.Component<ProductListProps,State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const title = navigation.getParam('title')
    const centerControl = <View style={{alignItems:'center'}}>
      <Text category="p2">店铺</Text>
      <LicensePlate carNumber={title} category="c1"/>
    </View>
    return { title,centerControl };
  };



  public state : State={
    list : []
  }




  private onProductPress = (id: string) => {
    // this.props.onItemPress(index);
    const product : Product = this.state.list.find(p=>p.id==id)
    this.props.navigation.navigate("ProductDetail",{product,title:product.productName})
  };

  private renderListItemElement = (item: productItemType): ListItemElement => {
    const { themedStyle } = this.props;
    if(item.empty){
      return <View style={[themedStyle.item,{backgroundColor:"transparent"}]}></View>
    }
    return (
      <ProductListItem
        style={themedStyle.item}
        activeOpacity={0.75}
        image={item.logo.imageSource}
        name={item.productName}
        // type={item.type}
        productSlogan = {item.productSlogan}
        price={`${item.price} 元`}
        // onAddPress={this.onProductAddPress}
        onPress={()=>this.onProductPress(item.id)}
      />
    );
  };

  private renderItem = (info: ListRenderItemInfo<Product>): ListItemElement => {
    const { item, index } = info;

    const listItemElement: ListItemElement = this.renderListItemElement(item);

    return React.cloneElement(listItemElement, { index });
  };


  public async componentWillMount(){

    const uid = this.props.navigation.getParam("uid")

    const rj = await getService(productListUrl(uid)) as RestfulJson
    // console.warn(JSON.stringify(rj))
    const products : Product[] = rj.data
    products.forEach(p=>{
      p.logo = productList[0].logo
    })

    this.setState({list:products})


  }


  public render(): React.ReactNode {
    // const { contentContainerStyle, themedStyle, data, ...restProps } = this.props;
    // const data = productList.length % 2 == 0 ? productList : productList.concat([{empty:true} as any])
    const {list} = this.state
    const data = list.length % 2 == 0 ? list : list.concat([{empty:true} as any])

    return (
      <List
        // {...restProps}
        // contentContainerStyle={[contentContainerStyle, themedStyle.container]}
        data={data}
        renderItem={this.renderItem}
        numColumns={2}
      />
    );
  }
}

export const ProductListPage = withStyles(ProductListComponent, (theme: ThemeType) => ({
  container: {},
  item: {
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: theme['background-basic-color-1'],
  },
}));
