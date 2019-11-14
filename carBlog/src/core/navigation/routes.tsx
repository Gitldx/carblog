import { useScreens } from 'react-native-screens';
import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
  NavigationContainer,
  NavigationRouteConfigMap,
} from 'react-navigation';
import StackViewStyleInterpolator from
  'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator'


import {
  MenuNavigationOptions, TransitionConfig, DynamicModalTransition, TopNavigationOptions,
} from './options';

import { HomePage, MyHomePage } from '@src/pages';
import { MenuPage } from '@src/pages/menu';
import { ArticlePage, ProductListPage, ProductDetailsPage, ParkingPage, ShareParkPage, SearchParkPage, ParkDetailPage } from '@src/pages/home';
import { getCurrentStateName, getCurrentRouteIndex } from './util';
import { ImageGallaryPage } from '@src/components/common';
import { SignInPage, SignUpPage } from '@src/pages/login';
import { ChatPage, MessagesPage } from '@src/pages/message';
import { ProductEditPage, ShopEditPage, BlogEditPage, MyBlogsPage, MyInfoPage, MyCollectionPage, ArticlePreviewPage, MyScorePage } from '@src/pages/my';
import { SearchCarPage } from '@src/pages/home/searchCar.page';
import { PayPage } from '@src/pages/my/pay.page';

import Jigsaw from '@src/pages/test/jigsaw'



const MyHomeNavigator: NavigationContainer = createStackNavigator(
  {
    ['MyHome']: {
      screen: MyHomePage,
      navigationOptions: ({ navigation }) => ({
        title: "我的",
      }),
    },
    ["myShop"]: ShopEditPage,
    ["myProduct"]: ProductEditPage,
    ["MyBlogs"]:MyBlogsPage,
    ["MyCollection"] : MyCollectionPage,
    ["MyInfo"] : MyInfoPage,
    ["MyScore"] : MyScorePage,
    ["Pay"] : PayPage,
   

  },
  {
    defaultNavigationOptions: MenuNavigationOptions,
    transitionConfig: TransitionConfig
    // transitionConfig: () => ({
    //   screenInterpolator: screenProps=> StackViewStyleInterpolator.forHorizontal,
    // })
  },
);



const HomeNavigator: NavigationContainer = createStackNavigator(
  {
    ['Home']: {
      screen: HomePage,
      // navigationOptions: ({ navigation }) => ({
      //    title: "首页",
      //   //  header: null
      // }),
      navigationOptions: TopNavigationOptions
    },
    
    ["ProductList"]: {
      screen: ProductListPage,
      navigationOptions: TopNavigationOptions//MenuNavigationOptions
      // navigationOptions : ({navigation})=>({

      // }),
    },
    ["ProductDetail"]: {
      screen: ProductDetailsPage,
      navigationOptions: TopNavigationOptions//MenuNavigationOptions
      // navigationOptions : ({navigation})=>({

      // }),
    },
    

  },
  {
    // defaultNavigationOptions: MenuNavigationOptions,
    transitionConfig: TransitionConfig

  },
);



HomeNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  // if (getCurrentStateName(navigation.state) == "Article") {
  //   tabBarVisible = false;
  // }
  if (getCurrentRouteIndex(navigation) != 0) {
    tabBarVisible = false
  }

  return {
    tabBarVisible,
  };
};




const MenuNavigator: NavigationContainer = createBottomTabNavigator({
  ['Home']: HomeNavigator,
  ['Messages']: Jigsaw,//MessagesPage,
  ['MyHome']: MyHomeNavigator,

},
  {
    tabBarComponent: MenuPage,
  }
);



const NavigationMap: NavigationRouteConfigMap = {
  ["ImagesGallary"]: {
    screen: ImageGallaryPage,
    navigationOptions: TopNavigationOptions
  },
  ["SignIn"]: {
    screen: SignInPage,
    navigationOptions: MenuNavigationOptions
  },
  ["SignUp"]: {
    screen: SignUpPage,
    navigationOptions: MenuNavigationOptions
  },
  ["Chat"]: {
    screen: ChatPage,
    // navigationOptions: MenuNavigationOptions
  },
  ["myBlog"]: {
    screen: BlogEditPage,
    navigationOptions: TopNavigationOptions
  },
  ["Article"]: {
    screen: ArticlePage,
    navigationOptions: TopNavigationOptions//MenuNavigationOptions
    // navigationOptions : ({navigation})=>({

    // }),
  },
  ["ArticlePreview"] :  {
    screen: ArticlePreviewPage,
    navigationOptions: TopNavigationOptions
  },
  ["SearchCar"]: {
    screen: SearchCarPage,
    // navigationOptions: TopNavigationOptions
  },
  ["Park"]: {
    screen: ParkingPage,
    // navigationOptions: TopNavigationOptions
  },
  ["SharePark"]: {
    screen: ShareParkPage,
    navigationOptions: TopNavigationOptions
  },
  ["SearchPark"]: {
    screen: SearchParkPage,
    navigationOptions: TopNavigationOptions
  },
  ["ParkDetail"]: {
    screen: ParkDetailPage,
    navigationOptions: TopNavigationOptions
  },

};


const AppNavigator: NavigationContainer = createStackNavigator({
  ['Home']: MenuNavigator,
  ...NavigationMap
  // ...AuthNavigationMap,
  // ...SocialNavigationMap,
  // ...ArticlesNavigationMap,
  // ...MessagingNavigationMap,
  // ...DarhboardsNavigationMap,
  // ...EcommerceNavigationMap,
  // ...TestNavigationMap
},
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      header: null
    },
  }

);


const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};


export const Router: NavigationContainer = createAppRouter(AppNavigator);