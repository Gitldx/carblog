import React from 'react';
import { View, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout, List } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar } from '@src/components/common';
import { ThemeContext, ThemeContextType } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { PageView } from '../pageView';
import { Article } from '@src/core/model';
import { RestfulJson, getService, listMyArticlesUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';




interface State {
  list : Article[]
}


type Props = ThemedComponentProps & NavigationScreenProps

export class MyBlogs extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '我的博客'
    }
  }

  public state: State = {
    list : []
  }


  private renderItem = (info:ListRenderItemInfo<Article>)=>{
    return (
      <ButtonBar leftText={info.item.title} onPress={()=>this.edit(info.item)}/>
    )
  }


  private edit = (article? : Article)=>{
    const saveHandler = this.listArticles
    this.props.navigation.navigate("myBlog",{article,saveHandler})
  }

  private listArticles = async ()=>{
    const rj : RestfulJson = await getService(listMyArticlesUrl(UserAccount.getUid())) as any

    this.setState({list:rj.data})
  }


  public componentDidMount(){
    this.listArticles()
  }

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    return (
      <PageView style={themedStyle.container}>

          <Button status="success" appearance="ghost" style={{marginBottom:20}} onPress={()=>this.edit()}>写文章</Button>

          <List data={this.state.list} renderItem={this.renderItem} style={{flex:1}}/>
      </PageView>
    );
  }
}


export const MyBlogsPage = withStyles(MyBlogs, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: theme['background-basic-color-1'],
  }
}));