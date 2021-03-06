import React from 'react';
import { View, ListRenderItemInfo, TouchableOpacity, ImageSourcePropType, Platform, PermissionsAndroid, RefreshControl, ImageBackground, Image } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, List, ListItem, ListItemProps, Text, Avatar } from 'react-native-ui-kitten';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import { PageView } from '../pageView';
import { AvatarContentBox, LicensePlate, LikeButton, VisitCounts } from '@src/components';
import { MaterialCommunityIcons, MessageCircleIconOutline, RedGreenImage, HelicopterImage, Road2mage, MetroImage } from '@src/assets/icons';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { CommentsButton } from '@src/components';
import { ImageSource, RemoteImage } from '@src/assets/images';
import { blogList, author1 } from '@src/core/data/articles';
import { Article, Profile, RoadChat, globalFields } from '@src/core/model';
import { getService, listArticleUrl, RestfulJson, listNearbyArticleUrl, qiniuImgUrl, NOTONLINE, RestfulResult, rj, rrnol, roadChatUrl, roadChatListUrl, postService, setUserCityCodeUrl, metroChatListUrl, metroChatUrl } from '@src/core/uitls/httpService';
import { toDate, getTimeDiff, gcj2wgs, displayIssueTime, isEmpty, showNoNetworkAlert } from '@src/core/uitls/common';
import EventRegister, { initAppOnlineCompleteEvent } from '@src/core/uitls/eventRegister';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Geolocation, init, Position } from '@src/components/amap/location';
import { BigThumbnailUri, smallThumbnailUrl } from '@src/assets/images/type';
import { getSevertimeDiff } from '@src/core/uitls/readParameter';
import { getLastLocationCity, saveLastCity, LastCity } from '@src/core/uitls/storage/locationStorage';
import { networkConnected } from '@src/core/uitls/netStatus';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { onlineAccountState } from '@src/core/userAccount/functions';
import { MetroLine, MetroChat } from '@src/core/model/metro.model';



declare var global: globalFields

type chat = RoadChat | MetroChat
type ListItemElementInfo = ListRenderItemInfo<chat>;

type Props = { tabLabel: string } & ThemedComponentProps & NavigationScreenProps



interface State {
    list: chat[],
    sortType: 0 | 1
    /**
     * 0:默认状态，1:正在加载，2:已到末尾
     */
    loading: 0 | 1 | 2,
    currentRoad: string,
    refreshing: boolean,
    /**
     * 1:马路，2，地铁
     */
    chatType: 1 | 2
}

export class RoadChatListComponent extends React.Component<Props, State> {

    // private testData: RoadChat[] = [
    //     { id: "1", uid: "1", authorProfile: { nickname: "ldx", carNumber: "YB123" }, chat: "堵车啊～", time: "30分钟前", distance: 0.102 },
    //     { id: "2", uid: "2", authorProfile: { nickname: "ldx2", carNumber: "JH123" }, chat: "堵堵更健康", time: "30分钟前", distance: 0.354 }
    // ]

    public state: State = {
        list: [],
        sortType: 1,
        loading: 0,
        currentRoad: "",
        refreshing: false,
        chatType: 1
    }



    private currentlocation_wgs: { longitude: number, latitude: number }

    private onPressed = (chat: chat) => {
        const ua: UserAccount = { id: chat.uid, nickname: chat.nickname, image: chat.image, carNumber: (chat as any).carNumber } as any
        this.props.navigation.navigate("UserBlog", { ua })
    }

    private renderItemHeader_roadChat(item: RoadChat): React.ReactElement {

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
                {!isEmpty(item.image) ? <Avatar source={smallThumbnailUrl(item.image)} style={{ width: 30, height: 30 }} /> :
                    <MaterialCommunityIcons name="account" color="lightgrey" style={{ height: 30, width: 30, textAlign: 'center', borderRadius: 15, borderColor: 'lightgrey', borderWidth: 1 }} />
                }
                <Text category="c2" style={{ marginLeft: 10 }}>{item.nickname}</Text>

                {!isEmpty(item.carNumber) && <LicensePlate carNumber={item.carNumber} category="c1" style={{ marginLeft: 5 }} />}

                {item.role == 2 && <FontAwesome5Icon name="walking" color="#f36c60" size={20} style={{ marginLeft: 5 }} />}

            </View>
        )
    }


    private renderItemHeader_metroChat(item: MetroChat): React.ReactElement {

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
                {!isEmpty(item.image) ? <Avatar source={smallThumbnailUrl(item.image)} style={{ width: 30, height: 30 }} /> :
                    <MaterialCommunityIcons name="account" color="lightgrey" style={{ height: 30, width: 30, textAlign: 'center', borderRadius: 15, borderColor: 'lightgrey', borderWidth: 1 }} />
                }
                <Text category="c2" style={{ marginLeft: 10 }}>{item.nickname}</Text>

            </View>
        )
    }

    // private renderItem1 = (info: ListItemElementInfo): React.ReactElement<ListItemProps> => {
    //     const { item } = info
    //     const d = item.distance

    //     return (
    //         <ListItem onPress={() => {
    //             this.onPressed(item)
    //         }}>
    //             <AvatarContentBox imagePosition="right" customTitleBox={() => this.renderItemHeader(item)} textParagraph={item.title}
    //                 paragraphApparent="default" paragraphCategory="s1" imageSource={item.image ? item.image.imageSource : null}
    //                 imageSize={80} imageShape="square"
    //             >
    //                 <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: this.state.sortType == 0 ? "space-between" : 'flex-end', paddingTop: 5 }}>

    //                     {this.state.sortType == 0 && <Text category="c1">{d >= 1 ? d.toFixed(2) + "公里" : (d * 1000).toFixed(0) + "米"}</Text>}

    //                     <View style={{ flexDirection: 'row' }}>
    //                         <VisitCounts rKTextProps={{ category: "c1", appearance: "default" }}>
    //                             {item.visitCounts.toString()}
    //                         </VisitCounts>

    //                         <CommentsButton rKTextProps={{ category: "c1", appearance: "default" }} iconSize={18}>
    //                             {item.comments ? item.comments.length.toString() : "0"}
    //                         </CommentsButton>
    //                         <LikeButton rKTextProps={{ category: "c1", appearance: "default" }} iconSize={18}>
    //                             {item.likes ? item.likes.length.toString() : "0"}
    //                         </LikeButton>
    //                     </View>
    //                 </View>
    //             </AvatarContentBox>
    //         </ListItem>
    //     )
    // }


    private renderFooter = (): React.ReactElement => {

        const { loading } = this.state

        if (!networkConnected() || !this.listLoaded) {
            return null
        }

        if (loading == 2) {
            return (
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ textAlign: 'center' }} appearance="hint">到底了</Text>
                </View>
            )
        }

        return (
            <TouchableOpacity style={{ marginVertical: 10 }} onPress={this.pressMore}>
                <Text style={{ textAlign: 'center' }} appearance="hint">{loading == 1 ? '正在加载...' : '点击加载更多'}</Text>
            </TouchableOpacity>
            // <Button style={{marginVertical:5}} appearance="ghost" textStyle={{color:'grey'}} onPress={this.props.pressMore}>{this.props.loading ? '正在加载...' :'点击加载更多'}</Button>
        )
    }


    private renderItem = (info: ListItemElementInfo): React.ReactElement<ListItemProps> => {
        const { item } = info
        if (this.state.chatType == 1) {
            return this.renderItem_roadChat(item as RoadChat)
        }
        else {
            return this.renderItem_metroChat(item as MetroChat)
        }
    }


    private renderItem_roadChat(item: RoadChat) {
        const d = item.distance
        const { themedStyle } = this.props
        return (
            <ListItem style={themedStyle.listItem} onPress={() => {
                this.onPressed(item)
            }}>

                <View style={{ flex: 1 }}>
                    {this.renderItemHeader_roadChat(item)}
                    <View style={{ paddingLeft: 16, paddingBottom: 0, flex: 1, justifyContent: 'center' }}>
                        <Text appearance="default" style={themedStyle.listItemContent}>{item.chat}</Text>
                    </View>
                    <View style={{ paddingLeft: 16, paddingBottom: 0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingTop: 5 }}>

                            <View style={{ flexDirection: 'row' }}>
                                {d && <Text appearance="hint" category="c1">{d >= 1 ? d.toFixed(2) + "公里" : (d * 1000).toFixed(0) + "米"}</Text>}
                                <Text appearance="hint" category="c1" style={{ marginLeft: 5 }}>{item.road}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text appearance="hint" category="c1" style={{ marginRight: 10 }}>{item.time}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ListItem>
        )
    }


    private renderItem_metroChat(item: MetroChat) {
        const { themedStyle } = this.props
        return (
            <ListItem style={themedStyle.listItem} onPress={() => {
                this.onPressed(item)
            }}>

                <View style={{ flex: 1 }}>
                    {this.renderItemHeader_metroChat(item)}
                    <View style={{ paddingLeft: 16, paddingBottom: 0, flex: 1, justifyContent: 'center' }}>
                        <Text appearance="default" style={themedStyle.listItemContent}>{item.chat}</Text>
                    </View>
                    <View style={{ paddingLeft: 16, paddingBottom: 0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", paddingTop: 5 }}>

                            {/* <View style={{ flexDirection: 'row' }}>
                                {d && <Text appearance="hint" category="c1">{d >= 1 ? d.toFixed(2) + "公里" : (d * 1000).toFixed(0) + "米"}</Text>}
                                <Text appearance="hint" category="c1" style={{ marginLeft: 5 }}>{item.road}</Text>
                            </View> */}
                            <View style={{ flexDirection: 'row' }}>
                                <Text appearance="hint" category="c1" style={{ marginRight: 10 }}>{item.time}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ListItem>
        )
    }

    private currentRoadText(text:string){
        const prefix = this.state.chatType == 1 ? "当前道路:" : "当前路线:"
        if(text.length <=12){
            return prefix + text
        }
        else{
            return text
        }
    }


    private renderHeader = () => {
        const { themedStyle } = this.props
        const { sortType, currentRoad } = this.state
        // const textStyle0 = sortType == 0 ? { color: "white" } : null
        // const style0 = sortType == 0 ? { backgroundColor: getThemeValue("color-success-default", themes["App Theme"]) } : null

        // const textStyle1 = sortType == 1 ? { color: "white" } : null
        // const style1 = sortType == 1 ? { backgroundColor: getThemeValue("color-success-default", themes["App Theme"]) } : null

        return (

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingLeft: 10 }}>
                <Text style={{maxWidth:"60%"}} appearance="hint" category="p2">{this.currentRoadText(currentRoad)}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <MaterialCommunityIcons size={20} name="helicopter" color={getThemeValue("color-success-default", themes["App Theme"])} /> */}
                    <Text style={[{ fontSize: 12, marginRight: 10 }, themedStyle.contentText]}>道路漫游</Text>

                    <TouchableOpacity onPress={this.selectRoad}>
                        <Avatar source={HelicopterImage.imageSource} resizeMode="contain" style={{ height: 35, width: 35 }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginHorizontal: 20 }} onPress={this.selectMetroline}>
                    <Avatar source={MetroImage.imageSource} resizeMode="contain" style={{ height: 25, width: 25 }} />
                        {/* <MaterialCommunityIcons size={25} name="subway" color={getThemeValue("color-success-default", themes["App Theme"])} /> */}
                    </TouchableOpacity>
                    {/* <Button onPress={this.selectRoad} size="small" appearance="ghost" textStyle={themedStyle.contentText}>
                        道路漫游>>
                    </Button> */}
                </View>
            </View>
        )
    }


    private selectRoad = () => {
        if (!networkConnected()) {
            showNoNetworkAlert()
            return
        }
        this.props.navigation.navigate("SelectRoad", { selectCallback: this.selectCallback })
    }


    private selectMetroline = () => {
        if (!networkConnected()) {
            showNoNetworkAlert()
            return
        }
        this.props.navigation.navigate("SelectMetroLines", { selectCallback: this.selectMetroLineCallback })
    }


    private issueCallback = (road, lng_wgs, lat_wgs) => {
        this.getList_roadChat(global.lastCity.cityCode, road, lng_wgs, lat_wgs)
    }

    private currentMetroline: MetroLine & { direction: number } = null
    private selectMetroLineCallback = async (metroLine: MetroLine, direction: number) => {
        this.currentPage = 0
        this.currentMetroline = { ...metroLine, direction }

        this.getList_metroChat(metroLine,direction)

    }


    private issueChat = () => {
        if (!networkConnected()) {
            showNoNetworkAlert()
            return
        }
        const {chatType} = this.state
        if(chatType == 1){
            this.props.navigation.navigate("IssueChat", { issueCallback: this.issueCallback})
        }
        else if(chatType == 2){
            const metroLine = this.currentMetroline;
            const direction = this.currentMetroline.direction;
            this.props.navigation.navigate("IssueMetroChat", { issueCallback: ()=>{this.getList_metroChat(metroLine,direction)},metroLine,direction})
        }
        
    }


    private async getCityAndRoad(callback: (oldCitycode: number, newCitycode: number, newCityName: string, road: string, lng: number, lat: number) => void) {

        if (Platform.OS == "android") {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
                title: "提示",
                message: "app需要获取地理位置权限，以便知道您所在道路",
                buttonPositive: "知道了"
            })

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                callback(null, null, null, null, null, null)
                return
            }
        }


        await init();

        let geoAllowed: boolean = false
        setTimeout(() => {
            if (!geoAllowed) {
                callback(null, null, null, null, null, null)
            }
        }, 3000);

        const city: LastCity = await getLastLocationCity()


        Geolocation.getCurrentPosition(({ coords }) => {
            const { longitude, latitude } = coords
            
            Geolocation.getReGeoCode({ latitude, longitude }, (reGeocode) => {

                geoAllowed = true
                global.lastCity = { cityCode: reGeocode.citycode, cityName: reGeocode.city }
                callback(city.cityCode, reGeocode.citycode, reGeocode.city, reGeocode.road, longitude, latitude)
            })
        })



    }






    private pressMore = () => {
        this.setState({ loading: 1 })
        const {chatType} = this.state
        
        if(chatType == 1){
            this.getMore_roadChat()
        }
        else if(chatType == 2){
            this.getMore_metroChat()
        }
        
    }


    private getMore_roadChat = async () => {
        this.currentPage++;
        // console.warn(this.currentPage)
        const rr = await getService(roadChatListUrl(global.lastCity.cityCode, this.state.currentRoad, this.currentPage,
            this.currentlocation_wgs.longitude, this.currentlocation_wgs.latitude))
        if (rrnol(rr)) {
            this.currentPage--
            return;
        }
        let lst1: RoadChat[] = rj(rr).data.roadchats
        lst1.forEach(c => {
            c.time = displayIssueTime(new Date(c.time))
        })
        const loading = lst1.length > 0 ? 0 : 2
        const temp = this.state.list.concat(lst1)
        this.setState({ loading, list: temp })

    }


    private getMore_metroChat = async () => {
        this.currentPage++;
        // console.warn(this.currentPage)
        const rr = await getService(metroChatListUrl(this.currentMetroline.id,this.currentMetroline.direction,this.currentPage))
        if (rrnol(rr)) {
            this.currentPage--
            return;
        }
        let lst1: MetroChat[] = rj(rr).data
        lst1.forEach(c => {
            c.time = displayIssueTime(new Date(c.time))
        })
        const loading = lst1.length > 0 ? 0 : 2
        const temp = this.state.list.concat(lst1)
        this.setState({ loading, list: temp })

    }




    private selectCallback = (citycode, road, longitude, latitude) => {
        const { lng, lat } = gcj2wgs(longitude, latitude)
        this.getList_roadChat(citycode, road, lng, lat)
    }


    private displayDirection = () => {
        return this.currentMetroline.direction == 12 ? this.currentMetroline.end1 + "->" + this.currentMetroline.end2 : this.currentMetroline.end2 + "->" + this.currentMetroline.end1
    }


    private list = () => {
        if (!networkConnected()) {
            return;
        }
        this.setState({ refreshing: true })
        this.listLoaded = true
        if (this.state.chatType == 1) {
            this.getCityAndRoad(async (oldCitycode, newCitycode, newCityName, road, longitude, latitude) => {

                if (isEmpty(road)) {//没有定位权限

                    this.canUseGeo = false
                    this.setState({ list: [], loading: 2, refreshing: false, chatType: 1 })
                    return;
                }
                else {
                    this.canUseGeo = true
                }

                const { lng, lat } = gcj2wgs(longitude, latitude)
                this.currentlocation_wgs = { longitude: lng, latitude: lat }


                if (isEmpty(oldCitycode) || oldCitycode != newCitycode) {

                    saveLastCity({ cityCode: newCitycode, cityName: newCityName })

                    const _us = onlineAccountState()
                    if (_us == 1 || _us == 2) {

                        await postService(setUserCityCodeUrl(UserAccount.getUid(), newCitycode), null)
                    }

                }

                this.getList_roadChat(newCitycode, road, lng, lat)
            })
        }
        else if (this.state.chatType == 2) {
            this.getList_metroChat(this.currentMetroline,this.currentMetroline.direction)
        }

    }

    private currentPage = 0
    private getList_roadChat = async (citycode, road, lng, lat) => {//note:上线前所有的分页改大一些
        this.currentPage = 0
        const rr = await getService(roadChatListUrl(citycode, road, 0, lng, lat))

        if (rrnol(rr)) {
            this.setState({ list: [], loading: 2, refreshing: false, chatType: 1 })
            return
        }

        let lst1: RoadChat[] = rj(rr).data.roadchats

        const lst2: RoadChat[] = rj(rr).data.nearRoadchats
        if (!isEmpty(lst2)) {
            lst2.forEach(c => {
                if (lst1.findIndex(r => r.id == c.id) == -1) {
                    lst1.push(c)
                }
            })
        }
        lst1.forEach(c => {
            c.time = displayIssueTime(new Date(c.time))
        })

        this.setState({ currentRoad: road, list: lst1, loading: 0, refreshing: false, chatType: 1 })
    }

    private getList_metroChat = async (metroLine : MetroLine,direction : number) => {
        this.currentPage = 0
        const rr = await getService(metroChatListUrl(metroLine.id, direction, 0))

        if (rrnol(rr)) {
            this.setState({ list: [], loading: 2, refreshing: false, chatType: 2 })
            return
        }

        let lst1: MetroChat[] = rj(rr).data || []

        lst1.forEach(c => {
            c.time = displayIssueTime(new Date(c.time))
        })

        this.setState({ currentRoad: metroLine.lineName + " " + this.displayDirection(), list: lst1, loading: 0, refreshing: false, chatType: 2 })
    }


    private canGetNext: boolean
    private onEndReached = () => {
        if (this.canGetNext) { this.pressMore(); this.canGetNext = false; }
    }

    private onMomentumScrollBegin = () => {
        this.canGetNext = true;
    }



    private listLoaded: boolean = false
    private canUseGeo: boolean = true
    private renderListEmptyComponent = (): React.ReactElement => {

        if (!this.listLoaded) {
            return (
                <View style={{ height: 600, paddingHorizontal: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Avatar shape="square" source={Road2mage.imageSource} style={{ height: 100, width: 100 }} />
                </View>
            )

        }

        const hint = this.canUseGeo ? "暂时空白，点击刷新再试试" : "未能获取到当前城市，请点击刷新或者到设置中心授权app使用定位"
        // console.warn(`renderListEmptyComponent,${hint}`)
        return (
            <TouchableOpacity onPress={this.list}
                style={{ height: 600, flex: 1, alignItems: 'center' }}>

                <View style={{ paddingHorizontal: 10, marginTop: 250, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <MaterialCommunityIcons name="emoticon-neutral-outline" color="lightgrey" size={30} /> */}
                    {/* <View style={{ paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}> */}
                    <Avatar source={Road2mage.imageSource} shape="square" style={{ height: 50, width: 50 }} resizeMode="contain" />
                    <Text style={{ marginLeft: 10 }}>{hint}</Text>
                    {/* </View> */}

                </View>
            </TouchableOpacity>
        )
    }


    private onRefreshing = () => {
        this.list()
    }




    public async componentWillMount() {
        EventRegister.addEventListener(initAppOnlineCompleteEvent, () => {
            this.list()//A-8

        })




    }



    public render(): React.ReactNode {
        // if (this.props.load == false) {
        //     return null
        // }

        const { themedStyle } = this.props
        return (
            <React.Fragment>
                <List
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefreshing}
                        />
                    }
                    data={this.state.list}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    getItemLayout={(data, index) => (
                        { length: 120, offset: 120 * index, index }
                    )}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.2}
                    onMomentumScrollBegin={this.onMomentumScrollBegin}
                />
                <TouchableOpacity style={themedStyle.addButton} onPress={this.issueChat}>
                    {/* <MaterialCommunityIcons name="traffic-light" size={30} color="white" /> */}
                    <Avatar source={RedGreenImage.imageSource} resizeMode="contain" style={{ height: 50,width:50 }} />
                </TouchableOpacity>
            </React.Fragment>
            // {/* <View style={themedStyle.bottomPadding}></View> */}
            // </View>

        );
    }


}

export const RoadChatList = withStyles(RoadChatListComponent, (theme: ThemeType) => ({
    bottomPadding: {
        height: 50,
        width: '100%',
        backgroundColor: theme['background-basic-color-1'],
    },
    addButton: {
        position: 'absolute', bottom: 50, right: 20, height: 50, width: 50, //borderRadius: 25,
        // borderWidth: 1, borderColor: "#f4433c",
        justifyContent: 'center', alignItems: 'center', opacity: 0.8,
        // backgroundColor: "#72d572"//theme["color-danger-400"]
    },
    listItem: {
        flexDirection: 'row', height: 120,
        borderBottomColor: theme['background-basic-color-4'], borderBottomWidth: 1
    },
    listItemContent: {
        fontSize: 14,
        color: theme["contentText-primary"]
    },
    contentText: {
        color: theme["contentText-primary"]
    }
}))