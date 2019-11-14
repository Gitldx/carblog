import React from 'react';
import { View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation';
// import { Layouts } from './layouts.component';
// import { LayoutsContainerData } from './type';
// import { routes } from './routes';
import { Button, Toggle, Text, withStyles, ThemeType, ThemedComponentProps, Layout } from 'react-native-ui-kitten';
import { Config } from '@src/core/uitls/config';
import { ButtonBar } from '@src/components/common';
import { ThemeContext, ThemeContextType } from '@src/core/themes';
import Icon from 'react-native-vector-icons/Ionicons'
import { PageView } from '../pageView';
import { SearchIconOutline, ArrowIosBackFill } from '@src/assets/icons';
import { Input } from '@src/components/common';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { LicensePlate } from '@src/components';




interface State {

}


type Props = ThemedComponentProps & NavigationScreenProps

export class SearchCar extends React.Component<Props, State> {

  public state: State = {

  }






  private goBack = () => {
    this.props.navigation.goBack(KEY_NAVIGATION_BACK)
  }

  public render(): React.ReactNode {

    const { themedStyle } = this.props
    return (
      <PageView style={themedStyle.container}>
        
        <View style={themedStyle.searchBar}>
          <Button size="giant" appearance="ghost" icon={ArrowIosBackFill} onPress={this.goBack}/>
          <Input style={{flex:1}} placeholder="输入车牌号"/>
          <Button appearance="ghost">搜索</Button>
        </View>

        <LicensePlate carNumber="琼B·JYT678" style={{marginTop: 15,marginLeft:15,alignSelf:'flex-start'}}/>

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
        </View>

      </PageView>

    );
  }
}


export const SearchCarPage = withStyles(SearchCar, (theme: ThemeType) => ({
  container: {
    flex: 1,
    
    // backgroundColor: theme['background-basic-color-1'],
  },
  searchBar : {
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: theme['background-basic-color-1'],
  }
}));