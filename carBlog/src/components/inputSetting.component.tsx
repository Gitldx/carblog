import React from 'react';
import {
  StyleProp,
  TextProps,
  TextStyle,
  View,
  ViewProps,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { Text, InputProps } from 'react-native-ui-kitten/ui';
import { textStyle, Input } from '@src/components/common';

interface ComponentProps {
  hint?: string;
  value: string;
  onChangeText(value : string):void
}

export type ProfileSettingProps = ComponentProps & ViewProps & ThemedComponentProps;

class InputSettingComponent extends React.Component<ProfileSettingProps> {

  private renderTextElement = (text: string, style: StyleProp<TextStyle>): React.ReactElement<TextProps> => {
    return (
      <Text
        style={style}
        appearance='hint'>
        {text}
      </Text>
    );
  };

  private renderInputElement = (text: string): React.ReactElement<InputProps> => {
    return (
      <Input style={{flex:2}} value = {text} onChangeText = {this.props.onChangeText}/>
    );
  };

  public render(): React.ReactNode {
    const { style, themedStyle, hint, value, ...restProps } = this.props;
    const { container, hintLabel, valueLabel } = themedStyle;

    return (
      <View
        {...restProps}
        style={[container, style]}>
        {hint ? this.renderTextElement(hint, hintLabel) : null}
        {this.renderInputElement(value)}
      </View>
    );
  }
}

export const InputSetting = withStyles(InputSettingComponent, (theme: ThemeType) => ({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  hintLabel: {...textStyle.caption2,flex:1},
  valueLabel: {
    color: theme['text-basic-color'],
    ...textStyle.caption2,
  },
}));
