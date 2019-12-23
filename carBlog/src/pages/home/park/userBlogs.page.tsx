import React from 'react';
import { View, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout, List, ListItem, Avatar } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar } from '@src/components/common';
import { ThemeContext, ThemeContextType } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { Article, Profile } from '@src/core/model';
import { RestfulJson, getService, listMyArticlesUrl, qiniuImgUrl, rrnol, rj } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { PageView } from '@src/pages/pageView';
import { VisitCounts, CommentsButton, LikeButton } from '@src/components';
import { author1 } from '@src/core/data/articles';
import { RemoteImage } from '@src/assets/images';
import { getTimeDiff, displayIssueTime } from '@src/core/uitls/common';
import { imageUri, thumbnailUri } from '@src/assets/images/type';




interface State {
  list: Article[]
}


type Props = ThemedComponentProps & NavigationScreenProps

export class UserBlogs extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const ua: UserAccount = navigation.getParam("ua")
    return {
      title: `${ua.nickname}的博客`
    }
  }

  public state: State = {
    list: []
  }


  private onPressed = (article: Article) => {
    this.props.navigation.navigate({
      routeName: 'Article',
      params: { title: article.authorProfile.nickname, article }
    })
  }


  private renderItem = (info: ListRenderItemInfo<Article>) => {
    const { item } = info
    return (
      // <ButtonBar leftText={info.item.title} onPress={()=>this.edit(info.item)}/>
      <ListItem style={{ flexDirection: 'row', height: 120 }} onPress={() => {
        this.onPressed(item)
      }}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingLeft: 16, paddingBottom: 0, flex: 1, justifyContent: 'center' }}>
            <Text appearance="default" category="s1" >{item.title}</Text>
          </View>
          <View style={{ paddingLeft: 16, paddingBottom: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 5 }}>


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

        {item.image && <View style={{ alignSelf: 'center', paddingHorizontal: 5 }}>
          <Avatar shape="square" source={thumbnailUri(item.image)} style={{ width: 80, height: 80 ,borderRadius:5}} />
        </View>}

      </ListItem>
    )
  }

  private renderEmpty = () => {
    return (
      <View style={{ height: 300, justifyContent: 'center' }}>
        <Text appearance="hint" style={{ textAlign: 'center' }}>车主他忙，啥也没写</Text>
      </View>
    )
  }




  private testimage = new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg")


  private listArticles = async (uid: string) => {
    const rr = await getService(listMyArticlesUrl(uid))
    if(rrnol(rr)){
      return
    }

    const temp: Article[] = rj(rr).data.map(m => {
      const date = new Date(m.date)

      m.date = displayIssueTime(date)//this.displayTime(getTimeDiff(date).toFixed(0))
      const profile: Profile = {
        id: this.ua.id,
        nickname: this.ua.nickname.length > 11 ? this.ua.nickname.substr(0, 10) + "..." : this.ua.nickname
        , image: this.ua.image //? new RemoteImage(qiniuImgUrl(this.ua.image)) : null 
        , carNumber: this.ua.carNumber
      }
      m.authorProfile = profile
      // m.image =m.image ? new RemoteImage(qiniuImgUrl(m.image)) : null//this.testimage
      return m;

      // return {id:m.id,authorName:author1.nickname.length >6 ? author1.nickname.substr(0,5)+"..." : author1.nickname,authorAvatar:author1.avatar,carNumber:author1.carNumber,blogTitle:m.title,content:m.content,likesCount:m.likes ? m.likes.length:0,
      //     comments:m.comments,visitCount : m.visitCounts,commentCount:m.comments?m.comments.length:0,
      //     image:this.testimage,blogTime:getTimeDiff(date).toFixed(0)+"小时前"}
    })

    this.setState({ list: temp })
  }

  private ua: UserAccount

  public componentDidMount() {
    this.ua = this.props.navigation.getParam("ua")
    this.listArticles(this.ua.id)
  }

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    return (
      <PageView style={themedStyle.container}>


        <List data={this.state.list} renderItem={this.renderItem} style={{ flex: 1 }}
          ListEmptyComponent={this.renderEmpty}
        />
      </PageView>
    );
  }
}


export const UserBlogsPage = withStyles(UserBlogs, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: theme['background-basic-color-1'],
  }
}));