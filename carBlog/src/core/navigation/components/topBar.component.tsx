import React from 'react';
import {
  StyleType,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { ImageProps, View, ViewStyle } from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  TopNavigationActionProps,
  TopNavigationProps,
  Text,
} from 'react-native-ui-kitten/ui';
import { textStyle } from '@src/components/common';
import { SafeAreaView } from './safeAreaView.component';

export interface ComponentProps {
  backIcon?: BackIconProp;
  onBackPress?: () => void;
  centerControl?: React.ReactElement,
  centerWidth? : number
  topBarStyle : ViewStyle
}

export type TopBarProps = TopNavigationProps & ComponentProps;

type BackIconProp = (style: StyleType) => React.ReactElement<ImageProps>;
type BackButtonElement = React.ReactElement<TopNavigationActionProps>;

class TopBarComponent extends React.Component<TopBarProps> {

  private onBackButtonPress = () => {
    if (this.props.onBackPress) {
      this.props.onBackPress();
    }
  };

  private renderBackButton = (source: BackIconProp): BackButtonElement => {
    return (
      <TopNavigationAction
        icon={source}
        onPress={this.onBackButtonPress}
        style={{marginLeft:15}}
      />
    );
  };

  public render(): React.ReactNode {
    const { themedStyle, topBarStyle,title, backIcon, leftControl, centerControl,centerWidth = 200, rightControls } = this.props;

    const leftControlElement: BackButtonElement | null = backIcon ? this.renderBackButton(backIcon) : null;

    return (
      <SafeAreaView style={[themedStyle.safeArea,topBarStyle]}>
        {/* <TopNavigation style ={{backgroundColor:"transparent"}}//香蕉黄
          alignment='center'
          title={title}
          titleStyle={textStyle.subtitle}
          subtitleStyle={textStyle.caption1}
          leftControl={leftControlElement}
        /> */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: leftControlElement ? 'flex-start' : 'center' }}>
          {leftControlElement}
          {leftControl ? leftControl : null}
        </View>
        <View style={{ width: (centerControl || title) ? centerWidth : 0, alignItems: 'center', justifyContent: 'center' }}>
          {centerControl ? centerControl : <Text category="p1">{title}</Text>}
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {rightControls ? rightControls : null}
        </View>
      </SafeAreaView>
    );
  }
}

export const TopBar = withStyles(TopBarComponent, (theme: ThemeType) => ({
  safeArea: {
    backgroundColor: theme['background-basic-color-1'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56
  },
}));
