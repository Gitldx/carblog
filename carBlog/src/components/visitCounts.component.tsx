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
import { HeartIconFill } from '@src/assets/icons';

interface ComponentProps {
  textStyle?: StyleProp<TextStyle>;
  rKTextProps? : TextProps,
  children?: string;
  fontSize? : number
}

export type VisitCountsProps = ThemedComponentProps & TouchableOpacityProps & ComponentProps;

class VisitCountsComponent extends React.Component<VisitCountsProps> {

  public render(): React.ReactNode {
    const { style, themedStyle, textStyle,rKTextProps = {appearance : "default",category:'p2'}, fontSize = 24,children, ...restProps } = this.props;

    return (
      <View
        style={[themedStyle.container, style]}
        {...restProps}>
        {/* {HeartIconFill([themedStyle.icon,{width:iconSize,height:iconSize}])} */}
        <Text appearance = {rKTextProps.appearance} category={rKTextProps.category}>浏览</Text>
        <Text
          style={[themedStyle.valueLabel, textStyle]}
          appearance = {rKTextProps.appearance}
          category={rKTextProps.category}>
          {children}
        </Text>
      </View>
    );
  }
}

export const VisitCounts = withStyles(VisitCountsComponent, (theme: ThemeType) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  valueLabel: {
    marginHorizontal: 8,
  },
}));
