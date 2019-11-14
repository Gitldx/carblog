import React from 'react';
import { View, ImageBackground, Platform } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { withStyles, ThemeType, ThemedComponentProps, Text, Button } from 'react-native-ui-kitten';


import { NavigationScreenConfig } from 'react-navigation';
import { ScrollPageView } from '../scrollPageView';
import { Article as ArticleModel, Comment, Profile } from '@src/core/model';
import { textStyle, Input, ScrollableAvoidKeyboard } from '@src/components/common';
import { CommentsList } from '@src/components/commentList';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CommentsButton, LikeButton, VisitCounts, ArticleContent } from '@src/components';
import { RemoteImage } from '@src/assets/images';
import { articles, author2, author1 } from '@src/core/data/articles';
import { getTimeDiff, toDate } from '@src/core/uitls/common';
import { postService, writeArticleUrl, commentUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';



type Props = ThemedComponentProps & NavigationScreenProps
type State = {
  currentCommentText: string,
  disableSubmitButton: boolean,
  loadComments: boolean,
  comments : Comment[]
}

class Article extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const title = navigation.getParam('title')
    return { title };
  };


  public state: State = {
    currentCommentText: '',
    disableSubmitButton: true,
    loadComments: false,
    comments : []
  }

  private keyboardOffset: number = Platform.select({
    ios: 40,
    android: 30,
  });


  private onLikePress = (index: number) => {
    console.warn("onLikePress" + index)
  }

  private onReplyMorePress = () => {
    console.warn("onReplyMorePress:")
  }


  private onCommentTextChange = (text: string) => {
    this.setState({ currentCommentText: text, disableSubmitButton: text.length == 0 });
  };

  private onCommentSubmit = () => {
    // const articleCopy: Article = this.state.article;
    // articleCopy.comments.push({
    //   author: profiles[Math.floor(Math.random() * profiles.length)],
    //   text: this.state.currentCommentText,
    //   likesCount: 1,
    //   date: 'Today 10:36 pm',
    // });
    const c : Comment = {author:UserAccount.getUid(),text:this.state.currentCommentText} as any
    postService(commentUrl(this.article.id),c).then(res=>{

      c.authorProfile = {avatar : author1.avatar,nickname:UserAccount.instance.nickname}
      c.date = new Date()
      c.dateString = toDate(c.date,"yyyy/MM/dd hh:mm:ss")
      this.state.comments.push(c) 

      this.setState({
        currentCommentText: '',
        disableSubmitButton: true,
        comments : this.state.comments
      });
    })


  };

  private onCommentCancel = () => {
    this.setState({
      currentCommentText: '',
      disableSubmitButton: true
    })
  }


  //   private article: ArticleModel = {
  //     title: '今天天气真好！',
  //     content: `风和日丽，秋高气爽，山清水秀，心情舒畅

  //     秋登兰山寄张五

  // 北山白云里，隐者自怡悦。
  // 相望试登高，心飞逐鸟灭。
  // 愁因薄暮起，兴是清秋发。
  // 时见归村人，沙行渡头歇。
  // 天边树若荠，江畔洲如月。
  // 何当载酒来，共醉重阳节。
  //     `,
  //     comments: [
  //       { author: { nickname: "hello" }, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
  //       { author: { nickname: "hello" }, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
  //       { author: { nickname: "hello" }, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
  //       { author: { nickname: "hello" }, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] },
  //       { author: { nickname: "hello" }, text: "文章写的不错", likesCount: 3, date: "2天前", comments: [] }

  //     ],
  //     image: new RemoteImage("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567446943433&di=26741cd7c2d234a484213844918f727e&imgtype=0&src=http%3A%2F%2Fimg5.xiazaizhijia.com%2Fwalls%2F20140618%2Fmid_5da9e14022bebcd.jpg"),
  //     likes: 34,
  //     visitCounts: 13,
  //     date: '4天前'
  //   }
  private article: ArticleModel

  public componentWillMount(){
    this.article = this.props.navigation.getParam("article")

    if(this.article.comments){
      this.article.comments = this.article.comments.map(c=>{
        // console.warn(`cdate:${c.date}`)
        const date =new Date(c.date)
        c.dateString = getTimeDiff(date).toFixed(0)+"小时前"
        const profile : Profile = {nickname:author2.nickname,avatar:author2.avatar}
        c.authorProfile = profile
        return c;
      })
    }
    else{
      this.article.comments = []
    }
    

  }

  public componentDidMount() {
    // console.warn(JSON.stringify(this.article))
    setTimeout(() => { this.setState({ loadComments: true ,comments : this.article.comments}) }, 0)
    
  }

  public render(): React.ReactNode {
    const { themedStyle } = this.props;
    const article = this.article

    return (
      <ScrollableAvoidKeyboard extraScrollHeight={this.keyboardOffset} style={themedStyle.container}>
        {/* <Text
          style={themedStyle.titleLabel}
          category='h6'>
          {article.title}
        </Text>
        <ImageBackground
          style={themedStyle.image}
          source={article.image.imageSource}
        />
        <Text
          style={themedStyle.contentLabel}
          category='s1'>
          {article.content}
        </Text> */}
        <ArticleContent article={article}/>
        <View style={themedStyle.articleAuthorContainer}>
       
          <Text
            style={themedStyle.articleDateLabel}
            appearance='hint'
            category='p2'>
            {article.date}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <VisitCounts rKTextProps={{ appearance: 'default', category: 'p2' }}>
              {article.visitCounts.toString()}
            </VisitCounts>
            <CommentsButton>
              {article.comments.length.toString()}
            </CommentsButton>
            <LikeButton>
              {article.likes? article.likes.length.toString() : "0"}
            </LikeButton>
          </View>
        </View>
        <View style={themedStyle.inputContainer}>
          <Text
            style={[themedStyle.inputLabel, themedStyle.inputSpace]}
            category='s1'>
            评论
          </Text>
          <Input
            style={themedStyle.inputSpace}
            textStyle={textStyle.paragraph}
            multiline={true}
            placeholder='写下你的评论'
            value={this.state.currentCommentText}
            onChangeText={this.onCommentTextChange}
            onSubmitEditing={this.onCommentSubmit}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 24, paddingVertical: 5 }}>
            <Button disabled={this.state.disableSubmitButton} size="small" style={{ marginRight: 24 }}
              onPress={this.onCommentSubmit}
            >发表</Button>
            <Button disabled={this.state.disableSubmitButton} size="small" onPress={this.onCommentCancel}>取消</Button>
          </View>
        </View>
        {this.state.loadComments ?
          <CommentsList
            data={this.state.comments}
            onLikePress={this.onLikePress}
            // onMorePress={this.onMorePress}
            onReplyMorePress={this.onReplyMorePress}
          />
          : null}

      </ScrollableAvoidKeyboard>
      // </ScrollPageView>

    );
  }


}


export const ArticlePage = withStyles(Article, (theme: ThemeType) => ({
  container: {
    // flex: 1,
    backgroundColor: theme['background-basic-color-1'],
  },
  image: {
    minHeight: 240,
  },
  titleLabel: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    ...textStyle.headline,
  },
  contentLabel: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
    ...textStyle.paragraph,
  },
  articleAuthorContainer: {
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputSpace: {
    marginHorizontal: 24,
  },
  inputContainer: {
    marginTop: 44,
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
    ...textStyle.subtitle,
  },
}));