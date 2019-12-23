import React from 'react';
import { View, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout, List, ListItem, Avatar } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar } from '@src/components/common';
import { ThemeContext, ThemeContextType } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { PageView } from '../pageView';
import { SearchIconOutline, ArrowIosBackFill } from '@src/assets/icons';
import { Input } from '@src/components/common';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { LicensePlate, VisitCounts, CommentsButton, LikeButton } from '@src/components';
import { Article, Profile } from '@src/core/model';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { isEmpty, getTimeDiff, displayIssueTime } from '@src/core/uitls/common';
import { RestfulJson, getService, getProfileByCarNumberUrl, rrnol, rj } from '@src/core/uitls/httpService';
import { author1 } from '@src/core/data/articles';
import { RemoteImage } from '@src/assets/images';
import { thumbnailUri } from '@src/assets/images/type';




interface State {
  searchText: string
  articles: Article[]
  userInfo: UserAccount
}


type Props = ThemedComponentProps & NavigationScreenProps

export class SearchCar extends React.Component<Props, State> {

  public state: State = {
    userInfo: undefined,
    articles: [],
    searchText: ""
  }


  private goBack = () => {
    this.props.navigation.goBack(KEY_NAVIGATION_BACK)
  }


  private testimage = new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg")



  private search = async () => {
    if (isEmpty(this.state.searchText)) {
      return;
    }
    const s = this.state.searchText.replace("·", "").toUpperCase()

    const rr = await getService(getProfileByCarNumberUrl(s))
    if(rrnol(rr)){
      return
    }

    if(rj(rr).data == null){
      
      this.setState({userInfo : null})
      return;
    }


    const ua: UserAccount = rj(rr).data.ua
    const articles: Article[] = rj(rr).data.articles || []

    
    const temp: Article[] = articles.map(m => {
      const date = new Date(m.date)

      m.date = displayIssueTime(date)//this.displayTime(getTimeDiff(date).toFixed(0))
      const profile: Profile = {
        id:ua.id,
        nickname: ua.nickname.length > 11 ? ua.nickname.substr(0, 10) + "..." : ua.nickname
        , carNumber: ua.carNumber
      }
      m.authorProfile = profile
      // m.image = this.testimage

      return m;

      // return {id:m.id,authorName:author1.nickname.length >6 ? author1.nickname.substr(0,5)+"..." : author1.nickname,authorAvatar:author1.avatar,carNumber:author1.carNumber,blogTitle:m.title,content:m.content,likesCount:m.likes ? m.likes.length:0,
      //     comments:m.comments,visitCount : m.visitCounts,commentCount:m.comments?m.comments.length:0,
      //     image:this.testimage,blogTime:getTimeDiff(date).toFixed(0)+"小时前"}
    })

    this.setState({ userInfo: ua, articles : temp })
  }

  private onChangeText = (val) => {
    this.setState({ searchText: val })
  }


  private gotoUserPage = () => {
    this.props.navigation.navigate("UserBlog",{ua:this.state.userInfo})
}


  private onPressed = (article: Article) => {
    const profile : Profile = this.state.userInfo
    this.props.navigation.navigate({
        routeName: 'Article',
        params: { profile,title: article.authorProfile.nickname, article}
    })
}


  private renderItem = (info:ListRenderItemInfo<Article>)=>{
    const {item} = info
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
                    <Avatar shape="square" source={thumbnailUri(item.image)} style={{ width: 80, height: 80 }} />
                </View>}

      </ListItem>
    )
  }


  private renderSearchResult = () => {
    const { userInfo, articles } = this.state

    if (userInfo === undefined) {
      return null
    }

    if (userInfo === null) {
      return (
        <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
          <Text appearance="hint" category="s1">尚无该车主记录</Text>
        </View>
      )
    }
    else {
      return (
        <React.Fragment>

          <View style={{ flexDirection: 'row',alignItems:'center', marginTop: 15, marginLeft: 15}}>
            <Text appearance="default" category="p1">{userInfo.nickname}</Text>
            <LicensePlate carNumber={userInfo.carNumber} style={{ marginLeft: 15, alignSelf: 'flex-start' }} />
          </View>

          {
            articles && articles.length > 0 &&
            <View>
              <View style={{ paddingHorizontal: 15,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>他的博客</Text>
                <Button appearance="ghost" onPress={this.gotoUserPage}>更多 >></Button>
              </View>
              <List
                data = {articles}
                renderItem = {this.renderItem}
              />
            </View>
          }



        </React.Fragment>
      )
    }
  }

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    return (
      <PageView style={themedStyle.container}>

        <View style={themedStyle.searchBar}>
          <Button size="giant" appearance="ghost" icon={ArrowIosBackFill} onPress={this.goBack} />
          <Input style={{ flex: 1 }} placeholder="输入车牌号" autoFocus={true} value={this.state.searchText} onChangeText={this.onChangeText} />
          <Button appearance="ghost" onPress={this.search}>搜索</Button>
        </View>

        {this.renderSearchResult()}

        {/* <LicensePlate carNumber="琼B·JYT678" style={{marginTop: 15,marginLeft:15,alignSelf:'flex-start'}}/>

        <View style={{paddingHorizontal: 15,}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
            <Text>他的商品</Text>
            <Button appearance="ghost">更多 ></Button>
          </View>
          <View></View>
        </View>

        <View style={{paddingHorizontal: 15,}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
            <Text>他的博客</Text>
            <Button appearance="ghost">更多 ></Button>
          </View>
          <View></View>
        </View> */}

      </PageView>

    );
  }
}


export const SearchCarPage = withStyles(SearchCar, (theme: ThemeType) => ({
  container: {
    flex: 1,

    // backgroundColor: theme['background-basic-color-1'],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme['background-basic-color-1'],
  }
}));