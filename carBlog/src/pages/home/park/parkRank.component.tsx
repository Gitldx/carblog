import React from 'react';
import { View, ListRenderItemInfo, TouchableOpacity } from 'react-native'
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
import { Article, Profile } from '@src/core/model';
import { getService, listArticleUrl, RestfulJson, postService, getProfilesUrl, rankParkUrl, setUserCityCodeUrl, qiniuImgUrl } from '@src/core/uitls/httpService';
import { toDate, getTimeDiff, isEmpty } from '@src/core/uitls/common';
import EventRegister, { initAppOnlineCompleteEvent } from '@src/core/uitls/eventRegister';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { Geolocation, init } from '@src/components/amap/location';
import { getLastLocationCityCode, saveLastCityCode, removeCityCode } from '@src/core/uitls/storage/locationStorage';
import { onlineAccountState } from '@src/core/userAccount/functions';
import { thumbnailUri } from '@src/assets/images/type';


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
    image: ImageSource,
    
}

type ListItemElementInfo = ListRenderItemInfo<UserAccount>;

type Props = { load?: boolean ,tabLabel:string} & ThemedComponentProps & NavigationScreenProps

interface State {
    list: UserAccount[],
    rankSort: 0 | 1 , //0:生产，1赠送
    /**
    * 0:默认状态，1:正在加载，2:已到末尾
    */
   loading: number
}

export class ParkRankComponent extends React.Component<Props, State> {



    public state: State = {
        list: [],
        rankSort: 0,
        loading : 0
    }

    // private data: BlogListItemData[] = blogList.map<BlogListItemData>(elm => { return { id:elm.id,authorName: elm.author.nickname, authorAvatar: elm.author.photo, blogTime: elm.date, carNumber: elm.author.carNumber, blogTitle: elm.title, commentCount: elm.comments.length, likesCount: elm.likes, visitCount: elm.visitCounts, image: elm.image } })
    private articles: Article[];

    private renderItemHeader(item: UserAccount): React.ReactElement {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5, }}>
                {item.image ? <Avatar source={thumbnailUri(item.image)} style={{ width: 30, height: 30 }} /> :
                    <MaterialCommunityIcons name="account" color="lightgrey" style={{ height: 30, width: 30, textAlign: 'center', borderRadius: 15, borderColor: 'lightgrey', borderWidth: 1 }} />
                }
                <Text category="c2" style={{ marginLeft: 10 }}>{item.nickname}</Text>
                {/* <View>
                    <Text>{item.carNumber}</Text>
                </View> */}
                <LicensePlate carNumber={item.carNumber} category="c1" style={{ marginLeft: 5 }} />
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
                            <Text>{item.totalProducedMoney}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name="medal" size={18} color="red" />
                            <Text>{item.totalGiftMoney}</Text>
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
            <ListItem style={{ height: 100 }} onPress={() => {
                this.gotoUserPage(item)

            }}>

                <View style={{ flex: 1, ...themedStyle.listItemContainer }}>
                    {this.renderItemHeader(item)}

                    <View style={{
                        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 16,
                        paddingTop: 16,
                    }}>


                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name="medal" size={18} color="green" />
                            <Text>{item.totalProducedMoney}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name="medal" size={18} color="red" />
                            <Text>{item.totalGiftMoney}</Text>
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


    private async getcitycode(callback: (oldcode: string, newcode: string) => void) {

        await init();

        const citycode: string = await getLastLocationCityCode()
        

        Geolocation.getCurrentPosition(({ coords }) => {
            const { longitude, latitude } = coords
          
            Geolocation.getReGeoCode({ latitude, longitude }, (reGeocode) => {
                // console.warn(JSON.stringify(reGeocode))
                callback(citycode, reGeocode.citycode)
            })
        })
    }

    private currentPage : number = 0

    private rank = (sort = 0) => { //todo:没有定位权限时，数据为空的提示,切换用户的时候把本地的citycode 清空，重新设置
        // removeCityCode()
        this.currentPage = 0
        this.getcitycode(async (oldcode, newcode) => {


            const rankrj: RestfulJson = await getService(rankParkUrl(newcode, sort, 0)) as any
            // console.warn(`old:${oldcode},new:${newcode}`)
           
            const loading = rankrj.data.length > 0 ? 0 : 2

            // const temp = (rankrj.data as UserAccount[]).map((u:UserAccount)=>{
                
            //     const ua = Object.assign({},u)
            //     ua.image = !!!isEmpty(u.image) ? new RemoteImage(qiniuImgUrl(u.image)) : null
            //     return ua
            // })

           

            this.setState({ list: rankrj.data,loading })

            if (isEmpty(oldcode) || oldcode != newcode) {
                console.warn(`old:${oldcode},new:${newcode}`)
                const _us = onlineAccountState()
                if(_us == 1 || _us == 2){
                    saveLastCityCode(newcode)  
                    await postService(setUserCityCodeUrl(UserAccount.getUid(), newcode), null)
                }
                
            }


        })

    }

    private getMore = async ()=>{
        this.setState({loading:1})
        this.currentPage++;

        const citycode: string = await getLastLocationCityCode()
        const rankrj: RestfulJson = await getService(rankParkUrl(citycode, this.state.rankSort, this.currentPage)) as any
        
        // const _temp = (rankrj.data as UserAccount[]).map((u:UserAccount)=>{
                
        //     const ua = Object.assign({},u)
        //     ua.image = !!!isEmpty(u.image) ? new RemoteImage(qiniuImgUrl(u.image)) : null
        //     return ua
        // })
        
        const temp = this.state.list.concat(rankrj.data)

        const loading = rankrj.data.length > 0 ? 0 : 2
        this.setState({list:temp,loading})
    }


    private renderFooter = (): React.ReactElement => {

        const { loading } = this.state

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


    public async componentWillMount() {




        EventRegister.addEventListener(initAppOnlineCompleteEvent, () => {

            this.rank()


            // const rj: RestfulJson = await getService(listArticleUrl(0)) as any
            // const articles: Article[] = rj.data.articles
            // const profiles: Profile[] = rj.data.profiles

            // const ids = new Set()
            // articles.forEach(d => {

            //     ids.add(d.uid)
            //     // d.image = this.testimage
            //     // d.comments = []
            // })



            // // const rj2 : RestfulJson = await postService(getProfilesUrl(),Array.from(ids)) as any //todo:服务端统一返回profile
            // // const profiles = rj2.data as UserAccount
            // // console.warn(JSON.stringify(profiles))

            // const temp: Article[] = articles.map(m => {
            //     const date = new Date(m.date)  //todo:服务器返回yyyy-MM-dd hh:mm:ss格式

            //     m.date = getTimeDiff(date).toFixed(0) + "小时前"
            //     const profile: Profile = {
            //         nickname: author1.nickname.length > 6 ? author1.nickname.substr(0, 5) + "..." : author1.nickname
            //         , avatar: author1.avatar, carNumber: author1.carNumber
            //     }
            //     m.authorProfile = profile
            //     m.image = this.testimage

            //     return m;

            //     // return {id:m.id,authorName:author1.nickname.length >6 ? author1.nickname.substr(0,5)+"..." : author1.nickname,authorAvatar:author1.avatar,carNumber:author1.carNumber,blogTitle:m.title,content:m.content,likesCount:m.likes ? m.likes.length:0,
            //     //     comments:m.comments,visitCount : m.visitCounts,commentCount:m.comments?m.comments.length:0,
            //     //     image:this.testimage,blogTime:getTimeDiff(date).toFixed(0)+"小时前"}
            // })
            // // console.warn(JSON.stringify(new Date("2019/10/27 16:30:23"))) 

            // this.articles = temp

            // this.setState({ list: temp })

        })




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
                    // data={this.data}
                    data={this.state.list}
                    renderItem={this.renderItem}
                    getItemLayout={(data, index) => (
                        { length: 100, offset: 100 * index, index }
                    )}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
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
    },
}))