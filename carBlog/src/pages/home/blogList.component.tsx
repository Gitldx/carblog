import React from 'react';
import { View, ListRenderItemInfo, TouchableOpacity, ImageSourcePropType, Platform, PermissionsAndroid, RefreshControl } from 'react-native'
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
import { blogList, author1 } from '@src/core/data/articles';
import { Article, Profile } from '@src/core/model';
import { getService, listArticleUrl, RestfulJson, listNearbyArticleUrl, qiniuImgUrl, NOTONLINE, RestfulResult, rj, rrnol } from '@src/core/uitls/httpService';
import { toDate, getTimeDiff, gcj2wgs, displayIssueTime, isEmpty, truncateText } from '@src/core/uitls/common';
import EventRegister, { initAppOnlineCompleteEvent } from '@src/core/uitls/eventRegister';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Geolocation, init, Position } from '@src/components/amap/location';
import { BigThumbnailUri, smallThumbnailUrl } from '@src/assets/images/type';
import { getSevertimeDiff } from '@src/core/uitls/readParameter';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { showMessage } from 'react-native-flash-message';


interface BlogListItemData {
    id: string,
    authorName: string,
    authorAvatar: ImageSource,
    blogTime: string,
    carNumber: string,
    blogTitle: string,
    commentCount: number,
    likesCount: number,
    visitCount: number,
    image: ImageSource
}

type ListItemElementInfo = ListRenderItemInfo<Article>;

type Props = { load: boolean, tabLabel: string } & ThemedComponentProps & NavigationScreenProps

interface State {
    list: Article[],
    sortType: 0 | 1
    /**
     * 0:默认状态，1:正在加载，2:已到末尾
     */
    loading: 0 | 1 | 2,
    refreshing: boolean
}

export class BlogListComponent extends React.Component<Props, State> {


    public state: State = {
        list: [],
        sortType: 1,
        loading: 0,
        refreshing : false
    }

    private articles: Article[];//todo:区分行人和车主的文章表
    private currentHotPage: number = 0
    private currentNearPage: number = 0

    private currentLatitude_wgs: number = null
    private currentLongitude_wgs: number = null

    private onPressed = (article: Article) => {
        // this.props.navigation.navigate({
        //     routeName: 'Article',
        //     params: { profile:article.authorProfile,title: article.authorProfile.nickname, article/* : this.articles.find(i => i.id == article.id) */ }
        // })
        this.props.navigation.push(
            'Article',
            { profile: article.authorProfile, title: article.authorProfile.nickname, article/* : this.articles.find(i => i.id == article.id) */ }
        )
    }

    private renderItemHeader(item: Article): React.ReactElement {

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
                {!isEmpty(item.authorProfile.image) ? <Avatar source={smallThumbnailUrl(item.authorProfile.image)/* (item.authorProfile.image as ImageSource).imageSource */} style={{ width: 30, height: 30 }} /> :
                    <MaterialCommunityIcons name="account" color="lightgrey" style={{ height: 30, width: 30, textAlign: 'center', borderRadius: 15, borderColor: 'lightgrey', borderWidth: 1 }} />
                }
                <Text category="c2" style={{ marginLeft: 10 }}>{item.authorProfile.nickname}</Text>
                {/* <View>
                    <Text>{item.carNumber}</Text>
                </View> */}
                {!isEmpty(item.authorProfile.carNumber) && <LicensePlate carNumber={item.authorProfile.carNumber} category="c1" style={{ marginLeft: 5 }} />}

            </View>
        )
    }



    private renderFooter = (): React.ReactElement => {

        const { loading,list } = this.state

        if(isEmpty(list)){
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
        const d = item.distance
        const { themedStyle } = this.props
        return (
            <ListItem style={themedStyle.listItem} onPress={() => {
                this.onPressed(item)
            }}>

                <View style={{ flex: 1 }}>
                    {this.renderItemHeader(item)}
                    <View style={{ paddingLeft: 16, paddingBottom: 0, flex: 1, justifyContent: 'center' }}>
                        <Text appearance="default" category="s1" style={themedStyle.listItemContent} >{item.title}</Text>
                    </View>
                    <View style={{ paddingLeft: 16, paddingBottom: 0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: this.state.sortType == 0 ? "space-between" : 'flex-end', paddingTop: 5 }}>

                            {this.state.sortType == 0 && <Text category="c1">{d >= 1 ? d.toFixed(2) + "公里" : (d * 1000).toFixed(0) + "米"}</Text>}

                            <View style={{ flexDirection: 'row' }}>
                                <Text appearance="default" category="c1" style={{ marginRight: 10 }}>{item.date}</Text>
                                <VisitCounts rKTextProps={{ category: "c1", appearance: "default" }}>
                                    {item.visitCounts.toString()}
                                </VisitCounts>

                                <CommentsButton rKTextProps={{ category: "c1", appearance: "default" }} iconSize={18}>
                                    {item.comments ? item.comments.length.toString() : "0"}
                                </CommentsButton>
                                <LikeButton rKTextProps={{ category: "c1", appearance: "default" }} iconSize={18}>
                                    {item.likes ? item.likes.length.toString() : "0"}
                                </LikeButton>
                            </View>
                        </View>
                    </View>
                </View>

                {!isEmpty(item.image) && <View style={{ alignSelf: 'center', paddingHorizontal: 5 }}>
                    <Avatar shape="square" source={BigThumbnailUri(item.image)} style={{ width: 80, height: 80, borderRadius: 5 }} />
                </View>}

            </ListItem>
        )
    }


    private sort = (sortType: 0 | 1) => {
        // this.setState({ sortType })

        if (sortType == 0) {
            this.listNear()
        }
        else {
            this.listHottest()
        }
    }


    private renderHeader = () => {

        const { sortType } = this.state
        const textStyle0 = sortType == 0 ? { color: "white" } : null
        const style0 = sortType == 0 ? { backgroundColor: getThemeValue("color-success-default", themes["App Theme"]) } : null

        const textStyle1 = sortType == 1 ? { color: "white" } : null
        const style1 = sortType == 1 ? { backgroundColor: getThemeValue("color-success-default", themes["App Theme"]) } : null

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 10 }}>
                <Text appearance="hint" category="p2">排序方式</Text>
                <Button textStyle={textStyle0} size="small" appearance="ghost" onPress={() => this.sort(0)}
                    style={style0}>附近</Button>
                <Button textStyle={textStyle1} size="small" style={style1} appearance="ghost" onPress={() => this.sort(1)}>热门</Button>
            </View>
        )
    }


    private writeBlog = () => {
        const s = onlineAccountState()
        if (s == 0 || s == -1) {
            showMessage({
                message: '提示',
                description: "撰写博客请先注册或登录账号",
                icon: "info",
                type: "info",
                position: 'center',
                duration: 3000
            })
            return;
        }
        this.props.navigation.navigate("myBlog")
    }



    private pressMore = () => {
        this.setState({ loading: 1 })
        if (this.state.sortType == 0) {
            this.getMore_near()
        }
        else {
            this.getMore_hot()
        }
    }

    isNotOnline(rj: RestfulJson) {
        return (rj as RestfulResult) == NOTONLINE
    }

    private getMore_near = async () => {
        this.currentNearPage++;
        const rr = await getService(listNearbyArticleUrl(this.currentLongitude_wgs, this.currentLatitude_wgs, this.currentNearPage))
        // console.warn(`rj:${JSON.stringify(rj)}`)
        if (rrnol(rr)) {
            return;
        }

        const articles: Article[] = rj(rr).data.articles
        const profiles: Profile[] = rj(rr).data.profiles

        const temp: Article[] = articles.map(m => {
            const date = new Date(m.date)

            m.date = displayIssueTime(date)

            const profile = Object.assign({}, profiles.find(p => p.id == m.uid))
            profile.nickname = truncateText(profile.nickname, 11)// profile.nickname.length > 11 ? profile.nickname.substr(0, 10) + "..." : profile.nickname
            m.authorProfile = profile

            return m;

        })


        this.articles = this.articles.concat(temp)


        const loading = rj(rr).data.articles.length > 0 ? 0 : 2
        this.setState({ list: this.articles, sortType: 0, loading })


    }

    private listNear = async () => {

        if (Platform.OS == "android") {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        }


        await init();

        Geolocation.getCurrentPosition(async (position: Position) => {
            const { longitude, latitude } = position.coords
            const { lng, lat } = gcj2wgs(longitude, latitude)

            this.currentLatitude_wgs = lat
            this.currentLongitude_wgs = lng
            this.setState({ refreshing: true })
            const rr = await getService(listNearbyArticleUrl(lng, lat, 0))
            if (rrnol(rr)) {
                this.setState({ refreshing: false })
                return;
            }

            // console.warn(`lng:${lng},data:${JSON.stringify(rr)}`)
            const articles: Article[] = rj(rr).data.articles
            const profiles: Profile[] = rj(rr).data.profiles
            // console.warn(`profiles:${JSON.stringify(profiles)}`)
            const temp: Article[] = articles.map(m => {
                const date = new Date(m.date)

                m.date = displayIssueTime(date)

                const profile = Object.assign({}, profiles.find(p => p.id == m.uid))
                profile.nickname = truncateText(profile.nickname, 11) //profile.nickname.length > 11 ? profile.nickname.substr(0, 10) + "..." : profile.nickname

                m.authorProfile = profile

                return m;


            })


            this.articles = temp
            this.currentNearPage = 0


            this.setState({ list: temp, sortType: 0, loading: 0 ,refreshing:false})

        })
    }


    private getMore_hot = async () => {
        this.currentHotPage++;

        const rr = await getService(listArticleUrl(this.currentHotPage))

        if (rrnol(rr)) {
            return;
        }

        const articles: Article[] = rj(rr).data.articles
        const profiles: Profile[] = rj(rr).data.profiles

        const temp: Article[] = articles.map(m => {
            const date = new Date(m.date)

            m.date = displayIssueTime(date)

            const profile = Object.assign({}, profiles.find(p => p.id == m.uid))
            // console.warn(`profile:${JSON.stringify(profile)}`)
            profile.nickname = truncateText(profile.nickname, 11) //profile.nickname.length > 11 ? profile.nickname.substr(0, 10) + "..." : profile.nickname
            // profile.image = profile.image ? new RemoteImage(qiniuImgUrl(profile.image as string)) : null
            m.authorProfile = profile

            return m;

        })
        // console.warn(JSON.stringify(new Date("2019/10/27 16:30:23"))) 

        this.articles = this.articles.concat(temp)

        const loading = temp.length > 0 ? 0 : 2


        this.setState({ list: this.articles, loading })
    }






    private listHottest = async () => {
        this.setState({ refreshing: true })
        const rr = await getService(listArticleUrl(0))
        if (rrnol(rr)) {
            this.setState({ refreshing: false })
            return;
        }
        const articles: Article[] = rj(rr).data.articles
        const profiles: Profile[] = rj(rr).data.profiles

        // const ids = new Set()
        // articles.forEach(d => {

        //     ids.add(d.uid)
        //     // d.image = this.testimage
        //     // d.comments = []
        // })



        // const rj2 : RestfulJson = await postService(getProfilesUrl(),Array.from(ids)) as any
        // const profiles = rj2.data as UserAccount
        // console.warn(JSON.stringify(profiles))

        const temp: Article[] = articles.map(m => {
            const date = new Date(m.date)

            m.date = displayIssueTime(date)

            const profile = Object.assign({}, profiles.find(p => p.id == m.uid))
            // console.warn(`profile:${JSON.stringify(profile)}`)
            profile.nickname = truncateText(profile.nickname, 11) //profile.nickname.length > 11 ? profile.nickname.substr(0, 10) + "..." : profile.nickname
            m.authorProfile = profile

            return m;


        })

        this.articles = temp
        this.currentHotPage = 0

        this.setState({ list: temp, sortType: 1, loading: 0,refreshing:false })
    }


    private canGetNext: boolean
    private onEndReached = () => {
        if (this.canGetNext) { this.pressMore(); this.canGetNext = false; }
    }

    private onMomentumScrollBegin = () => {
        this.canGetNext = true;
    }

    private onRefreshing = () => {
        const sortType = this.state.sortType
        if (sortType == 0) {
            this.listNear()
        }
        else {
            this.listHottest()
        }
    }

    public async componentWillMount() {
        EventRegister.addEventListener(initAppOnlineCompleteEvent, () => {

            this.listHottest()

        })




    }


    // public componentWillUpdate(nextProps: Props, nextState) {
    //     const { load } = nextProps
    //     if (this.props.load && load) {

    //         return false
    //     }
    // }

    private hasLoaded: boolean = false
    componentWillReceiveProps(nextProps) {
        if (!this.props.load && nextProps.load == true && !this.hasLoaded) {
            this.hasLoaded = true;
            this.listHottest()
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
                    getItemLayout={(data, index) => (
                        { length: 120, offset: 120 * index, index }
                    )}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.2}
                    onMomentumScrollBegin={this.onMomentumScrollBegin}
                />
                <TouchableOpacity style={themedStyle.addButton} onPress={this.writeBlog}>
                    <MaterialCommunityIcons name="tooltip-edit" size={30} color="white" />
                </TouchableOpacity>
            </React.Fragment>
            // {/* <View style={themedStyle.bottomPadding}></View> */}
            // </View>

        );
    }


}

export const BlogList = withStyles(BlogListComponent, (theme: ThemeType) => ({
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
    listItem: {
        flexDirection: 'row', height: 120,
        borderBottomColor: theme['background-basic-color-4'], borderBottomWidth: 1
    },
    listItemContent: {
        color: theme["contentText-primary"]
    }
}))