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




interface State {
  
}


type Props = ThemedComponentProps & NavigationScreenProps

export class MyCollection extends React.Component<Props, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {
      title: '我的收藏'
    }
  }

  public state: State = {

  }


  private renderItem = (info:ListRenderItemInfo<any>)=>{
    return (
      <ButtonBar leftText="儿童玩具" onPress={this.edit} showIcon={false}/>
    )
  }


  private edit = ()=>{
    this.props.navigation.navigate("myBlog")
  }

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    return (
      <PageView style={themedStyle.container}>

         

          <List data={[1,2,3]} renderItem={this.renderItem} style={{flex:1}}/>
      </PageView>
    );
  }
}


export const MyCollectionPage = withStyles(MyCollection, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: theme['background-basic-color-1'],
  }
}));