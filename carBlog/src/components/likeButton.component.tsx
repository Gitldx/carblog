import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { Text, TextProps } from 'react-native-ui-kitten/ui';
import { HeartIconFill } from '@src/assets/icons';

interface ComponentProps {
  textStyle?: StyleProp<TextStyle>;
  rKTextProps?: TextProps,
  children?: string;
  iconSize?: number,
  canAction?: boolean
}

export type LikeButtonProps = ThemedComponentProps & TouchableOpacityProps & ComponentProps;

class LikeButtonComponent extends React.Component<LikeButtonProps> {

  static defaultProps: ComponentProps = {
    canAction: false
  }


  public render(): React.ReactNode {
    const { style, themedStyle, textStyle, rKTextProps = { appearance: "default", category: 'p2' }, iconSize = 24, children, canAction, ...restProps } = this.props;

    return (
      canAction ?
        <TouchableOpacity
          style={[themedStyle.container, style]}
          {...restProps}>
          {HeartIconFill([themedStyle.icon, { width: iconSize, height: iconSize }])}
          <Text
            style={[themedStyle.valueLabel, textStyle]}
            appearance={rKTextProps.appearance}
            category={rKTextProps.category}>
            {children}
          </Text>
        </TouchableOpacity>
        :
        <View style={[themedStyle.container, style]}
          {...restProps}>
          {HeartIconFill([themedStyle.icon, { width: iconSize, height: iconSize }])}
          <Text
            style={[themedStyle.valueLabel, textStyle]}
            appearance={rKTextProps.appearance}
            category={rKTextProps.category}>
            {children}
          </Text>

        </View>
    );
  }
}

export const LikeButton = withStyles(LikeButtonComponent, (theme: ThemeType) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    tintColor: theme['color-danger-default'],
  },
  valueLabel: {
    marginHorizontal: 8,
  },
}));
