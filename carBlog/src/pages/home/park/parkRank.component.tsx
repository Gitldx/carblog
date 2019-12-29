import React from 'react';
import { View, ListRenderItemInfo, TouchableOpacity, PermissionsAndroid, Platform, TouchableWithoutFeedback, TouchableHighlight, RefreshControl } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, List, ListItem, ListItemProps, Text, Avatar } from 'react-native-ui-kitten';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import { PageView } from '../../pageView';
import { AvatarContentBox, LicensePlate, LikeButton, VisitCounts, ContentBox } from '@src/components';
import { MaterialCommunityIcons, MessageCircleIconOutline } from '@src/assets/icons';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { CommentsButton } from '@src/components';
import { ImageSource, RemoteImage } from '@src/assets/images';
import { blogList, author1 } from '@src/core/data/articles';
import { Article, Profile, globalFields } from '@src/core/model';
import { getService, listArticleUrl, RestfulJson, postService, getProfilesUrl, rankParkUrl, setUserCityCodeUrl, qiniuImgUrl, rrnol, rj } from '@src/core/uitls/httpService';
import { toDate, getTimeDiff, isEmpty } from '@src/core/uitls/common';
import EventRegister, { initAppOnlineCompleteEvent } from '@src/core/uitls/eventRegister';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Geolocation, init } from '@src/components/amap/location';
import { getLastLocationCityCode, saveLastCityCode, removeCityCode } from '@src/core/uitls/storage/locationStorage';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { thumbnailUri } from '@src/assets/images/type';
import { networkConnected } from '@src/core/uitls/netStatus';


declare var global: globalFields

type ListItemElementInfo = ListRenderItemInfo<UserAccount>;

type Props = { load?: boolean, tabLabel: string } & ThemedComponentProps & NavigationScreenProps

interface State {
    list: UserAccount[],
    rankSort: 0 | 1, //0:生产，1赠送
    /**
    * 0:默认状态，1:正在加载，2:已到末尾
    */
    loading: 0 | 1 | 2,
    refreshing: boolean
}

export class ParkRankComponent extends React.Component<Props, State> {



    public state: State = {
        list: [],
        rankSort: 0,
        loading: 0,
        refreshing: false
    }

    // private data: BlogListItemData[] = blogList.map<BlogListItemData>(elm => { return { id:elm.id,authorName: elm.author.nickname, authorAvatar: elm.author.photo, blogTime: elm.date, carNumber: elm.author.carNumber, blogTitle: elm.title, commentCount: elm.comments.length, likesCount: elm.likes, visitCount: elm.visitCounts, image: elm.image } })
    private articles: Article[];

    private renderItemHeader(item: UserAccount): React.ReactElement {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5, }}>
                {!isEmpty(item.image) ? <Avatar source={thumbnailUri(item.image)} style={{ width: 30, height: 30 }} /> :
                    <MaterialCommunityIcons name="account" color="lightgrey" style={{ height: 30, width: 30, textAlign: 'center', borderRadius: 15, borderColor: 'lightgrey', borderWidth: 1 }} />
                }
                <Text category="c2" style={{ marginLeft: 10 }}>{item.nickname}</Text>
                {/* <View>
                    <Text>{item.carNumber}</Text>
                </View> */}
                {!isEmpty(item.carNumber) && <LicensePlate carNumber={item.carNumber} category="c1" style={{ marginLeft: 5 }} />}
                {/* <Text appearance="hint" category="c1" style={{ marginLeft: 20 }}>{item.date}</Text> */}
            </View>
        )
    }

    private renderItem1 = (info: ListItemElementInfo): React.ReactElement<ListItemProps> => {
        const { item } = info
        return (
            <ListItem onPress={() => {
                this.gotoUserPage(item)
                // this.props.navigation.navigate({
                //     routeName: 'Article',
                //     params: { title: item.nickname, article: this.articles.find(i => i.id == item.id) }
                // })
            }}>
                <ContentBox style={{ flex: 1 }} customTitleBox={() => this.renderItemHeader(item)} /* textParagraph={item.title} */
                /* paragraphApparent="default" paragraphCategory="s1" */

                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 5 }}>

                        {/* <VisitCounts rKTextProps={{ category: "c1", appearance: "default" }}>
                            {item.visitCounts.toString()}
                        </VisitCounts>

                        <CommentsButton rKTextProps={{ category: "c1", appearance: "default" }} iconSize={18}>
                            {item.comments ? item.comments.length.toString():"0"}
                        </CommentsButton>
                        <LikeButton rKTextProps={{ category: "c1", appearance: "default" }} iconSize={18}>
                            {item.likes ? item.likes.length.toString() : "0"}
                        </LikeButton> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name="medal" size={18} color="green" />
                            <Text>{item.totalProducedMoney.toString()}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name="medal" size={18} color="red" />
                            <Text>{item.totalGiftMoney.toString()}</Text>
                        </View>
                    </View>
                </ContentBox>
            </ListItem>
        )
    }



    private renderItem = (info: ListItemElementInfo): React.ReactElement<ListItemProps> => {
        const { item } = info
        // console.warn(`mondey:${JSON.stringify(item)}`)
        const { themedStyle } = this.props
        return (
            <ListItem style={{ height: 100,...themedStyle.listItemContainer  }} onPress={() => {
                this.gotoUserPage(item)

            }}>

                <View style={{ flex: 1, }}>
                    {this.renderItemHeader(item)}

                    <View style={{
                        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 16,
                        paddingTop: 16,
                    }}>


                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name="medal" size={18} color="green" />
                            <Text>{item.totalProducedMoney.toString()}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name="medal" size={18} color="red" />
                            <Text>{item.totalGiftMoney.toString()}</Text>
                        </View>
                    </View>
                </View>

            </ListItem>
        )
    }

    private gotoUserPage = (userAccount: UserAccount) => {
        this.props.navigation.navigate("UserBlog", { ua: userAccount })
    }




    public componentWillUpdate(nextProps: Props, nextState) {
        const { load } = nextProps
        if (this.props.load && load) {

            return false
        }
    }

    private testimage = new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg")


    private sort = (sortType: 0 | 1) => {
        this.setState({ rankSort: sortType })
        this.rank(sortType)
    }

    private renderHeader = () => {
        const { rankSort } = this.state
        const textStyle0 = rankSort == 0 ? { color: "white" } : null
        const style0 = rankSort == 0 ? { backgroundColor: getThemeValue("color-success-default", themes["App Theme"]) } : null

        const textStyle1 = rankSort == 1 ? { color: "white" } : null
        const style1 = rankSort == 1 ? { backgroundColor: getThemeValue("color-success-default", themes["App Theme"]) } : null

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 10 }}>
                <Text appearance="hint" category="p2">排序方式</Text>
                <Button textStyle={textStyle0} size="small" appearance="ghost" onPress={() => this.sort(0)}
                    style={style0}>生产车位币</Button>
                <Button textStyle={textStyle1} size="small" style={style1} appearance="ghost" onPress={() => this.sort(1)}>赠送车位币</Button>
            </View>
        )
    }


    private async getcitycode(callback: (oldcode: number, newcode: number) => void) {

        if (Platform.OS == "android") {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
                title: "提示",
                message: "app需要获取地理位置权限，以便知道您所在方位",
                buttonPositive: "知道了"
            })

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                callback(null, null)
                return
            }
        }


        await init();

        let geoAllowed: boolean = false
        setTimeout(() => {
            if (!geoAllowed) {
                callback(null, null)
            }
        }, 3000);

        const citycode: number = await getLastLocationCityCode()
        if (!global.citycode) {
            Geolocation.getCurrentPosition(({ coords }) => {
                const { longitude, latitude } = coords

                Geolocation.getReGeoCode({ latitude, longitude }, (reGeocode) => {

                    geoAllowed = true
                    global.citycode = reGeocode.citycode
                    callback(citycode, reGeocode.citycode)
                })
            })
        }
        else {
            geoAllowed = true
            callback(citycode, global.citycode)
        }


    }

    private currentPage: number = 0

    private rank = (sort = 0) => {
        this.listLoaded = true
        
        this.currentPage = 0
        if(!networkConnected()){
            this.setState({list:[],loading:2})
            return
        }

        this.setState({ refreshing: true })

        this.getcitycode(async (oldcode, newcode) => {

            if (isEmpty(newcode)) {//没有定位权限
                this.canUseGeo = false
                this.setState({ list: [], loading: 2,refreshing:false })
                return;
            }
            else {
                this.canUseGeo = true
            }

            const rankrr = await getService(rankParkUrl(newcode, sort, 0))
            if (rrnol(rankrr)) {
                this.setState({ list: [], loading: 2,refreshing:false })
                return
            }
            // console.warn(`old:${oldcode},new:${newcode}`)

            const loading = rj(rankrr).data.length > 0 ? 0 : 2

            // const temp = (rankrj.data as UserAccount[]).map((u:UserAccount)=>{

            //     const ua = Object.assign({},u)
            //     ua.image = !!!isEmpty(u.image) ? new RemoteImage(qiniuImgUrl(u.image)) : null
            //     return ua
            // })



            this.setState({ list: rj(rankrr).data, loading,refreshing:false })

            if (isEmpty(oldcode) || oldcode != newcode) {
                saveLastCityCode(newcode)
                // console.warn(`old:${oldcode},new:${newcode}`)
                const _us = onlineAccountState()
                if (_us == 1 || _us == 2) {
                    
                    await postService(setUserCityCodeUrl(UserAccount.getUid(), newcode), null)
                }

            }


        })

    }

    private getMore = async () => {
        this.setState({ loading: 1 })
        this.currentPage++;

        const citycode: number = await getLastLocationCityCode()
        const rankrr = await getService(rankParkUrl(citycode, this.state.rankSort, this.currentPage))
        // console.warn(`getMore:${JSON.stringify(rankrr)},currentPage:${this.currentPage}`)
        if (rrnol(rankrr)) {
            this.currentPage--;
            return;
        }
        // const _temp = (rankrj.data as UserAccount[]).map((u:UserAccount)=>{

        //     const ua = Object.assign({},u)
        //     ua.image = !!!isEmpty(u.image) ? new RemoteImage(qiniuImgUrl(u.image)) : null
        //     return ua
        // })

        const temp = this.state.list.concat(rj(rankrr).data)

        const loading = rj(rankrr).data.length > 0 ? 0 : 2
        this.setState({ list: temp, loading })
    }


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
            <TouchableOpacity style={{ marginVertical: 10 }} onPress={this.getMore}>
                <Text style={{ textAlign: 'center' }} appearance="hint">{loading == 1 ? '正在加载...' : '点击加载更多'}</Text>
            </TouchableOpacity>
        )
    }

    private listLoaded: boolean = false
    private canUseGeo: boolean = true
    private renderListEmptyComponent = (): React.ReactElement => {

        if (!this.listLoaded) {
            return null
        }

        // if (networkConnected()) {
        //     return (
        //         <View style={{ height: 600, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        //             <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        //             <MaterialCommunityIcons name="emoticon-neutral-outline" color="lightgrey" size={30}/>
        //             <Text style={{marginLeft:10}}>当前区域暂无内容</Text>
        //             </View>
        //         </View>
        //     )
        // }

        const hint = this.canUseGeo ? "暂时空白，点击刷新再试试" : "未能获取到当前城市，请到设置中心授权app使用定位"

        return (
            <TouchableOpacity onPress={() => this.rank(this.state.rankSort)}
                style={{ height: 600, paddingHorizontal: 10, flex: 1, alignItems: 'center' }}>
                {/* <Button 
                    icon={(styles) => MaterialCommunityIcons({ name: "emoticon-neutral-outline", color: styles.tintColor }) as any}
                    appearance="ghost" size="giant">{hint}</Button> */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginTop: 250, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="emoticon-neutral-outline" color="lightgrey" size={30} />
                    <Text style={{ marginLeft: 10 }}>{hint}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    private onRefreshing = () => {
        this.rank()
    }


    public async componentWillMount() {
        // console.warn(`parkRank mount`)
        EventRegister.addEventListener(initAppOnlineCompleteEvent, () => {

            this.rank()

        })

    }


    private hasLoaded: boolean = false
    componentWillReceiveProps(nextProps) {
        if (!this.props.load && nextProps.load == true && !this.hasLoaded) {
            this.hasLoaded = true;
            this.rank()
        }

    }


    public render(): React.ReactNode {
        if (this.props.load == false) {
            return null
        }

        const { themedStyle } = this.props
        return (
            // <View style={{ height: '100%' }}>
            <React.Fragment>
                <List style={{ height: '100%' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefreshing}
                        />
                    }
                    data={this.state.list}
                    renderItem={this.renderItem}
                    getItemLayout={(data, index) => (
                        { length: 100, offset: 100 * index, index }
                    )}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderListEmptyComponent}
                />

            </React.Fragment>
            // {/* <View style={themedStyle.bottomPadding}></View> */}
            // </View>

        );
    }


}

export const ParkRank = withStyles(ParkRankComponent, (theme: ThemeType) => ({
    bottomPadding: {
        height: 50,
        width: '100%',
        backgroundColor: theme['background-basic-color-1'],
    },
    addButton: {
        position: 'absolute', bottom: 50, right: 20, height: 50, width: 50, borderRadius: 25,
        justifyContent: 'center', alignItems: 'center', opacity: 0.8,
        backgroundColor: theme["color-success-400"]
    },
    listItemContainer: {
        paddingTop: 5,
        backgroundColor: theme['background-basic-color-1'],
        borderBottomColor: theme['background-basic-color-4'], borderBottomWidth: 1
    },
}))