import React from 'react';
import { View, ListRenderItemInfo, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, withStyles, ThemeType, ThemedComponentProps, List, ListItem, ListItemProps, Text, Avatar } from 'react-native-ui-kitten';
import { ThemeContext, ThemeContextType, themes } from '@src/core/themes';
import { PageView } from '../../pageView';
import { AvatarContentBox, LicensePlate, LikeButton, VisitCounts } from '@src/components';
import { MaterialCommunityIcons, MessageCircleIconOutline } from '@src/assets/icons';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { CommentsButton } from '@src/components';
import { ImageSource, RemoteImage } from '@src/assets/images';
import { blogList, author1 } from '@src/core/data/articles';
import { Article, Profile } from '@src/core/model';
import { getService, listArticleUrl, RestfulJson, postService, getProfilesUrl } from '@src/core/uitls/httpService';
import { toDate, getTimeDiff } from '@src/core/uitls/common';
import EventRegister, { initAppOnlineCompleteEvent } from '@src/core/uitls/eventRegister';
import { UserAccount } from '@src/core/userAccount/userAccount';


interface BlogListItemData {
    id : string,
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

type Props = {load?:boolean} & ThemedComponentProps & NavigationScreenProps

interface State {
    list : Article[]
}

export class AskParkListComponent extends React.Component<Props,State> {

    // private data: BlogListItemData[] = [
    //     { authorName: '蓝色天空', blogTime: '25天前', carNumber: "粤B·GH6YO9", blogTitle: '很舒服很放松很放松放松', commentCount: 13, likesCount: 100,visitCount:300,
    //     image : new RemoteImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg')
    //  },
    //     { authorName: '自由遨翔', blogTime: '14:53', carNumber: "粤B·WHYO9K", blogTitle: '解放军圣诞节弗拉索夫吉林省地方扉哦你距离封疆大吏房间里睡觉发呆放松疗法手机放楼上的', commentCount: 45, likesCount: 300,visitCount:673 },
    //     { authorName: '蓝色天空', blogTime: '25天前', carNumber: "粤B·GH6YO9", blogTitle: '很舒服很放松很放松放松', commentCount: 13, likesCount: 100,visitCount:300,
    //     image : new RemoteImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg')
    //  },
    //     { authorName: '自由遨翔', blogTime: '14:53', carNumber: "粤B·WHYO9K", blogTitle: '解放军圣诞节弗拉索夫吉林省地方扉哦你距离封疆大吏房间里睡觉发呆放松疗法手机放楼上的', commentCount: 45, likesCount: 300,visitCount:673 },
    //     { authorName: '蓝色天空', blogTime: '25天前', carNumber: "粤B·GH6YO9", blogTitle: '很舒服很放松很放松放松', commentCount: 13, likesCount: 100,visitCount:300,
    //     image : new RemoteImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg')
    //  },
    //     { authorName: '自由遨翔', blogTime: '14:53', carNumber: "粤B·WHYO9K", blogTitle: '解放军圣诞节弗拉索夫吉林省地方扉哦你距离封疆大吏房间里睡觉发呆放松疗法手机放楼上的', commentCount: 45, likesCount: 300,visitCount:673 },
    //     { authorName: '蓝色天空', blogTime: '25天前', carNumber: "粤B·GH6YO9", blogTitle: '很舒服很放松很放松放松', commentCount: 13, likesCount: 100,visitCount:300,
    //     image : new RemoteImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg')
    //  },
    //     { authorName: '自由遨翔', blogTime: '14:53', carNumber: "粤B·WHYO9K", blogTitle: '解放军圣诞节弗拉索夫吉林省地方扉哦你距离封疆大吏房间里睡觉发呆放松疗法手机放楼上的', commentCount: 45, likesCount: 300,visitCount:673 },
    //     { authorName: '蓝色天空', blogTime: '25天前', carNumber: "粤B·GH6YO9", blogTitle: '很舒服很放松很放松放松', commentCount: 13, likesCount: 100,visitCount:300,
    //     image : new RemoteImage('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg')
    //  },
    //     { authorName: '自由遨翔', blogTime: '14:53', carNumber: "粤B·WHYO9K", blogTitle: '解放军圣诞节弗拉索夫吉林省地方扉哦你距离封疆大吏房间里睡觉发呆放松疗法手机放楼上的', commentCount: 45, likesCount: 300,visitCount:673 }
    // ]

    public state : State={
        list : []
    }

    // private data: BlogListItemData[] = blogList.map<BlogListItemData>(elm => { return { id:elm.id,authorName: elm.author.nickname, authorAvatar: elm.author.photo, blogTime: elm.date, carNumber: elm.author.carNumber, blogTitle: elm.title, commentCount: elm.comments.length, likesCount: elm.likes, visitCount: elm.visitCounts, image: elm.image } })
    private articles : Article[];

    private renderItemHeader(item: Article): React.ReactElement {

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
                {item.authorProfile.image ? <Avatar source={item.authorProfile.image.imageSource} style={{width:30,height:30}}/> :
                    <MaterialCommunityIcons name="account" color="lightgrey" style={{ height: 30, width: 30, textAlign: 'center', borderRadius: 15, borderColor: 'lightgrey', borderWidth: 1 }} />
                }
                <Text category="c2" style={{ marginLeft: 10 }}>{item.authorProfile.nickname}</Text>
                {/* <View>
                    <Text>{item.carNumber}</Text>
                </View> */}
                <LicensePlate carNumber={item.authorProfile.carNumber} category="c1" style={{ marginLeft: 5 }} />
                <Text appearance="hint" category="c1" style={{ marginLeft: 20 }}>{item.date}</Text>
            </View>
        )
    }

    private renderItem = (info: ListItemElementInfo): React.ReactElement<ListItemProps> => {
        const { item } = info
        return (
            <ListItem onPress={() => { this.props.navigation.navigate({ routeName: 'Article', 
            params: { title: item.authorProfile.nickname ,article:this.articles.find(i=>i.id==item.id)} }) }}>
                <AvatarContentBox imagePosition="right" customTitleBox={() => this.renderItemHeader(item)} textParagraph={item.title}
                    paragraphApparent="default" paragraphCategory="s1" imageSource={item.image ? item.image.imageSource : null}
                    imageSize={80} imageShape="square"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 5 }}>

                        <VisitCounts rKTextProps={{ category: "c1", appearance: "default" }}>
                            {item.visitCounts.toString()}
                        </VisitCounts>

                        <CommentsButton rKTextProps={{ category: "c1", appearance: "default" }} iconSize={18}>
                            {item.comments ? item.comments.length.toString():"0"}
                        </CommentsButton>
                        <LikeButton rKTextProps={{ category: "c1", appearance: "default" }} iconSize={18}>
                            {item.likes ? item.likes.length.toString() : "0"}
                        </LikeButton>
                    </View>
                </AvatarContentBox>
            </ListItem>
        )
    }


    private writeBlog = ()=>{
        this.props.navigation.navigate("myBlog")
    }




    public componentWillUpdate(nextProps : Props, nextState){
        const {load} = nextProps
        if(this.props.load && load){
            
            return false
        }
    }

    private testimage = new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg")


    public async componentWillMount(){
        EventRegister.addEventListener(initAppOnlineCompleteEvent,async ()=>{
            const rj : RestfulJson = await getService(listArticleUrl(0)) as any
        const articles : Article[]= rj.data.articles
        const profiles : Profile[] = rj.data.profiles
        
        const ids = new Set()
        articles.forEach(d=>{
          
            ids.add(d.uid)
            // d.image = this.testimage
            // d.comments = []
        })

        

        // const rj2 : RestfulJson = await postService(getProfilesUrl(),Array.from(ids)) as any //todo:服务端统一返回profile
        // const profiles = rj2.data as UserAccount
        // console.warn(JSON.stringify(profiles))
        
        const temp : Article[] = articles.map(m=>{
            const date = new Date(m.date)  //todo:服务器返回yyyy-MM-dd hh:mm:ss格式
            
            m.date = getTimeDiff(date).toFixed(0)+"小时前"
            const profile : Profile = {nickname:author1.nickname.length >6 ? author1.nickname.substr(0,5)+"..." : author1.nickname
                ,image : author1.image,carNumber : author1.carNumber}
            m.authorProfile = profile
            m.image = this.testimage
           
            return m;
            
            // return {id:m.id,authorName:author1.nickname.length >6 ? author1.nickname.substr(0,5)+"..." : author1.nickname,authorAvatar:author1.avatar,carNumber:author1.carNumber,blogTitle:m.title,content:m.content,likesCount:m.likes ? m.likes.length:0,
            //     comments:m.comments,visitCount : m.visitCounts,commentCount:m.comments?m.comments.length:0,
            //     image:this.testimage,blogTime:getTimeDiff(date).toFixed(0)+"小时前"}
        })
        // console.warn(JSON.stringify(new Date("2019/10/27 16:30:23"))) 

        this.articles = temp

        this.setState({list:temp})

        })

        

        
    }


    public render(): React.ReactNode {
        if(this.props.load == false){
            return null
        }

        const { themedStyle } = this.props
        return (
            // <View style={{ height: '100%' }}>
                <React.Fragment>
                    <List style={{height:'100%'}}
                    // data={this.data}
                    data={this.state.list}
                    renderItem={this.renderItem}
                />
              
                </React.Fragment>
                // {/* <View style={themedStyle.bottomPadding}></View> */}
            // </View>

        );
    }


}

export const AskParkList = withStyles(AskParkListComponent, (theme: ThemeType) => ({
    bottomPadding: {
        height: 50,
        width: '100%',
        backgroundColor: theme['background-basic-color-1'],
    },
    addButton:{
        position:'absolute',bottom:50,right:20,height:50,width:50,borderRadius:25,
        justifyContent:'center',alignItems:'center',opacity:0.8,
        backgroundColor:theme["color-success-400"]
    }
}))