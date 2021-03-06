import React from 'react';
import { View, ImageBackground, Platform } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { withStyles, ThemeType, ThemedComponentProps, Text, Button } from 'react-native-ui-kitten';

import { Article as ArticleModel, Comment, Profile } from '@src/core/model';
import { textStyle, Input, ScrollableAvoidKeyboard } from '@src/components/common';

import { imageUri, LocalImage } from '@src/assets/images/type';
import { isEmpty } from '@src/core/uitls/common';



type Props = { article: ArticleModel } & ThemedComponentProps

class ArticleContentComponent extends React.Component<Props> {





  private article: ArticleModel

  public componentWillMount() {
    this.article = this.props.article
  }

  public componentDidMount() {

  }

  public render(): React.ReactNode {
    const { themedStyle } = this.props;
    const article = this.article

    return (
      <React.Fragment>
        <Text
          style={themedStyle.titleLabel}
          category='h6'>
          {article.title}
        </Text>

        {!isEmpty(article.image) && <ImageBackground
          style={[{ aspectRatio: article.imgRatio ? article.imgRatio : 1 }, themedStyle.image]}
          source={article.image.startsWith("file://") ? new LocalImage(article.image).imageSource : imageUri(article.image)}
        />}
        <Text
          style={themedStyle.contentLabel}
          category='s1'>
          {article.content}
        </Text>

      </React.Fragment>


    );
  }


}


export const ArticleContent = withStyles(ArticleContentComponent, (theme: ThemeType) => ({

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
  }
}));