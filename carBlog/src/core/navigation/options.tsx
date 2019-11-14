import React from 'react';
import { Alert, Platform } from 'react-native';
import {
  NavigationParams,
  NavigationScreenProps,
  StackViewTransitionConfigs
} from 'react-navigation';
// import { EcommerceHeader } from '../../../src/components/ecommerce';
import { MenuPage } from '@src/pages/menu';
import { ArrowIosBackFill } from '@src/assets/icons';
import { TopNavigationBar } from './components/topNavigationBar.component';
import {
  getCurrentRouteState,
  isRootRoute,
  NavigationRouteState,
  getCurrentRouteIndex,
  getCurrentnavigationOptions,
} from './util';
import { KEY_NAVIGATION_BACK } from './constants';
import { TopBar } from './components/topBar.component';
import { Text } from 'react-native-ui-kitten';

export type TopNavigationElement = React.ReactElement<any>;
export type BottomNavigationElement = React.ReactElement<any>;

export interface TopNavigationParams extends NavigationParams {
  header: (props: NavigationScreenProps) => TopNavigationElement | null;
}

export interface BottomNavigationParams extends NavigationParams {
  bottomNavigation: (props: NavigationScreenProps) => BottomNavigationElement | null;
}

const MenuTopNavigationParams: TopNavigationParams = {
  header: (props: NavigationScreenProps): TopNavigationElement => {
    // @ts-ignore (private API)
    const { routeName } = getCurrentRouteState(props.navigation);
    const index: number = getCurrentRouteIndex(props.navigation);
    const { title } = getCurrentnavigationOptions(props)

    return (
      <TopNavigationBar
        {...props}
        title={title}
        backIcon={isRootRoute(index) && ArrowIosBackFill}
        onBackPress={() => {
          props.navigation.goBack(KEY_NAVIGATION_BACK);
        }}
      />
    );
  },
};

const TopNavigationParams: TopNavigationParams = {
  header: (props: NavigationScreenProps): TopNavigationElement => {
    // @ts-ignore (private API)
    const { routeName } = getCurrentRouteState(props.navigation);
    const index: number = getCurrentRouteIndex(props.navigation);
    const { title, leftControl, centerControl,centerWidth, rightControls,topBarStyle } = getCurrentnavigationOptions(props)
    const backIcon = leftControl ? null : isRootRoute(index) && ArrowIosBackFill
    // const leftControl = null//<Text>left</Text>
    // const centerControl = null//<Text>center</Text>
    // const rightControls = <Text>right</Text>
    // console.warn(`TopNavigationParams:${JSON.stringify(getCurrentnavigationOptions(props))}`)
    return (
      <TopBar {...props} backIcon={backIcon}
        title={title}
        topBarStyle = {topBarStyle}
        onBackPress={() => {
          props.navigation.goBack(KEY_NAVIGATION_BACK);
        }}
        centerWidth = {centerWidth}
        leftControl={leftControl} centerControl={centerControl} rightControls={rightControls} />
    );
  },
};

// const EcommerceMenuTopNavigationParams: TopNavigationParams = {
//   header: (props: NavigationScreenProps): TopNavigationElement => {
//     const state: NavigationRouteState = getCurrentRouteState(props.navigation);

//     const onBackPress = () => {
//       props.navigation.goBack(KEY_NAVIGATION_BACK);
//     };

//     const onSearchPress = () => {
//       Alert.alert('Search...');
//     };

//     const onShoppingCartPress = () => {
//       props.navigation.navigate({
//         key: state.routeName,
//         routeName: 'Shopping Cart',
//       });
//     };

//     return (
//       <EcommerceHeader
//         title={state.routeName}
//         onBack={onBackPress}
//         onSearch={onSearchPress}
//         onShoppingCart={onShoppingCartPress}
//       />
//     );
//   },
// };

const MenuBottomNavigationParams: BottomNavigationParams = {
  bottomNavigation: (props: NavigationScreenProps): BottomNavigationElement => {
    return (
      <MenuPage {...props} />
    );
  },
};

export const MenuNavigationOptions: NavigationParams = {
  ...MenuTopNavigationParams,
  ...MenuBottomNavigationParams,
};

export const TopNavigationOptions: NavigationParams = {
  ...TopNavigationParams,
  ...MenuBottomNavigationParams,
};

// export const SocialNavigationOptions: NavigationParams = MenuTopNavigationParams;

// export const ArticlesNavigationOptions: NavigationParams = MenuTopNavigationParams;

// export const DashboardNavigationOptions: NavigationParams = MenuTopNavigationParams;

// export const EcommerceNavigationOptions: NavigationParams = EcommerceMenuTopNavigationParams;


export const TransitionConfig = () => (
  Platform.select({
    ios: null,
    android: {
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const translateX = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [layout.initWidth, 0, 0]
        });

        const opacity = position.interpolate({
          inputRange: [
            index - 1,
            index - 0.99,
            index,
            index + 0.99,
            index + 1
          ],
          outputRange: [0, 1, 1, 0.3, 0]
        });

        return { opacity, transform: [{ translateX }] };
      }
    }
  })
)


const IOS_MODAL_ROUTES = ['Article'];

export const DynamicModalTransition = (transitionProps, prevTransitionProps) => {
  const isModal = IOS_MODAL_ROUTES.some(
    screenName =>
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
  )
  return StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal
  );
};