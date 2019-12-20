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




type Props = ThemedComponentProps & NavigationScreenProps
type State = {
  currentCommentText: string,
  disableSubmitButton: boolean,
  loadComments: boolean,
  comments : Comment[]
}

class ArticlePreview extends React.Component<Props> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const title = "预览"
    return { title };
  };



  private article: ArticleModel

  public componentWillMount(){
    this.article = this.props.navigation.getParam("article")
  

  }

  public componentDidMount() {
    // console.warn(JSON.stringify(this.article))
    setTimeout(() => { this.setState({ loadComments: true ,comments : this.article.comments}) }, 0)
    
  }

  public render(): React.ReactNode {
    const { themedStyle } = this.props;
    const article = this.article

    return (
      <ScrollPageView style={themedStyle.container}>
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
       

      </ScrollPageView>
      // </ScrollPageView>

    );
  }


}


export const ArticlePreviewPage = withStyles(ArticlePreview, (theme: ThemeType) => ({
  container: {
    // flex: 1,
    backgroundColor: theme['background-basic-color-1'],
  }
}));