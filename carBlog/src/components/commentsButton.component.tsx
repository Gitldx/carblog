import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { Text, TextProps } from 'react-native-ui-kitten/ui';
import { MessageCircleIconOutline } from '@src/assets/icons';

interface ComponentProps {
  textStyle?: StyleProp<TextStyle>;
  rKTextProps? : TextProps,
  children?: string,
  iconSize? : number
}

export type CommentsButtonProps = ThemedComponentProps & TouchableOpacityProps & ComponentProps;

class CommentsButtonComponent extends React.Component<CommentsButtonProps> {

  public render(): React.ReactNode {
    const { style, themedStyle, textStyle,rKTextProps = {appearance : "default",category:'p2'}, iconSize = 24,children, ...restProps } = this.props;

    return (
      <TouchableOpacity
        style={[themedStyle.container, style]}
        {...restProps}>
        {MessageCircleIconOutline([themedStyle.icon,{width:iconSize,height:iconSize}])}
        <Text
          style={[themedStyle.valueLabel, textStyle]}
          appearance = {rKTextProps.appearance}
          category = {rKTextProps.category}
          >
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
}

export const CommentsButton = withStyles(CommentsButtonComponent, (theme: ThemeType) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: theme['text-hint-color'],
  },
  valueLabel: {
    marginHorizontal: 8,
  },
}));
