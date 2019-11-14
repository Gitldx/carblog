import React from 'react';
import {
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { Config } from '@src/core/uitls/config';
import { themes } from '@src/core/themes';

export type ScrollPageViewProps = ScrollViewProps;

/**
 * React Native ScrollView component, but modified to remove bounces by default
 *
 * Used everywhere per app, where content needs to be scrollable to fit layout to device screen
 */
export class ScrollPageView extends React.Component<ScrollPageViewProps> {

  public render(): React.ReactElement<ScrollViewProps> {
    const {style,...restProps} = this.props
    return (
      <ScrollView
        bounces={false}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        style = {[{backgroundColor:getThemeValue("background-basic-color-2",themes[Config.currentTheme])},style]}
        {...restProps}
      />
    );
  }
}
