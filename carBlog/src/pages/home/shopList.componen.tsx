import React from 'react';
import { View, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, List, ListItem, ListItemProps, Text, Avatar } from 'react-native-ui-kitten';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import { PageView } from '../pageView';
import { AvatarContentBox, LicensePlate, LikeButton, VisitCounts } from '@src/components';
import { MaterialCommunityIcons, MessageCircleIconOutline } from '@src/assets/icons';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { CommentsButton } from '@src/components';
import { ImageSource, RemoteImage } from '@src/assets/images';

import { Shop, Product, Profile } from '@src/core/model';
import { shops, shopList } from '@src/core/data/products';
import { RestfulJson, getService, shopListUrl } from '@src/core/uitls/httpService';
import { author2 } from '@src/core/data/articles';
import EventRegister, { initAppOnlineCompleteEvent } from '@src/core/uitls/eventRegister';


// interface BlogListItemData {
//     id : string,
//     authorName: string,
//     authorAvatar: ImageSource,
//     blogTime: string,
//     carNumber: string,
//     blogTitle: string,
//     commentCount: number,
//     likesCount: number,
//     visitCount: number,
//     image?: ImageSource
// }

type ShopListItem = Shop | Product

type ListItemElementInfo = ListRenderItemInfo<ShopListItem>;

type Props = ThemedComponentProps & NavigationScreenProps

interface State{
    shopingSort : 0 | 1
    shopList : (Shop | Product)[]
}

export class ShopListComponent extends React.Component<Props,State> {


    private data: ShopListItem[] = shopList;

    public state : State ={
        shopingSort : 1,
        shopList : []
    }


    private renderItemHeader(data: ShopListItem): React.ReactElement {

        const item : Shop = data as Shop

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
                {/* {item.logo ? <Avatar source={item.logo.imageSource} style={{width:30,height:30}}/> :
                    <MaterialCommunityIcons name="account" color="lightgrey" style={{ height: 30, width: 30, textAlign: 'center', borderRadius: 15, borderColor: 'lightgrey', borderWidth: 1 }} />
                } */}
                <Text category="c2" style={{ marginLeft: 10 }}>{item.owner.nickname}</Text>
                {/* <View>
                    <Text>{item.carNumber}</Text>
                </View> */}
                <LicensePlate carNumber={item.owner.carNumber} category="c1" style={{ marginLeft: 5 }} />
                {/* <Text appearance="hint" category="c1" style={{ marginLeft: 20 }}>{item.blogTime}</Text> */}
            </View>
        )
    }

    private renderItem = (info: ListItemElementInfo): React.ReactElement<ListItemProps> => {
        const { item : i } = info
        const item : Shop = i as Shop
        return (
            <ListItem onPress={() => { this.props.navigation.navigate({ routeName: 'ProductList', params: { title: item.owner.carNumber,uid:item.uid } }) }}>
                <AvatarContentBox imagePosition="left" customTitleBox={() => this.renderItemHeader(item)} textParagraph={item.slogan}
                    paragraphApparent="hint" paragraphCategory="p2" imageSource={item.logo ? item.logo.imageSource : null}
                    imageSize={80} imageShape="square"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 5 }}>

                        <VisitCounts rKTextProps={{ category: "c1", appearance: "default" }}>
                            {item.visitCounts.toString()}
                        </VisitCounts>
                    </View>
                </AvatarContentBox>
            </ListItem>
        )
    }


    private renderHeader = ()=>{
        const {shopingSort} = this.state
        const textStyle0 = shopingSort == 0 ? {color : "white"} : null
        const style0 = shopingSort == 0 ? {backgroundColor:getThemeValue("color-success-default",themes["App Theme"])} : null

        const textStyle1 = shopingSort == 1 ? {color : "white"} : null
        const style1= shopingSort == 1 ? {backgroundColor:getThemeValue("color-success-default",themes["App Theme"])} : null

        return (
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingVertical:10}}>
                <Text appearance="hint" category="p2">排序方式</Text>
                <Button textStyle={textStyle0} size="small" appearance="ghost" onPress={()=>this.setState({shopingSort:0})}
                style={style0}>附近</Button>
                <Button textStyle = {textStyle1} size="small" style ={style1} appearance="ghost" onPress={()=>this.setState({shopingSort:1})}>热门</Button>
            </View>
        )
    }


    public componentWillMount(){

        EventRegister.addEventListener(initAppOnlineCompleteEvent,async ()=>{
            const rj1 : RestfulJson = await getService(shopListUrl(0)) as any
        
            const shopList : Shop[] = rj1.data.shops;
            const profiles : Profile[] = rj1.data.profiles;
            
            shopList.forEach(elm=>{
                elm.logo = shops[0].logo
                elm.owner = author2
            })
    
            this.setState({shopList})
        })


    }



    public render(): React.ReactNode {

        const { themedStyle } = this.props
        const {shopList} = this.state
        return (
            <View style={{ height: '100%' }}>
                <List
                    data={shopList}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderHeader}
                />
                {/* <View style={themedStyle.bottomPadding}></View> */}
            </View>

        );
    }


}

export const ShopList = withStyles(ShopListComponent, (theme: ThemeType) => ({
    bottomPadding: {
        height: 40,
        width: '100%',
        backgroundColor: theme['background-basic-color-1'],
    }
}))