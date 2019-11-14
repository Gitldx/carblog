import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { Text, TextProps, OverflowMenu, Button, OverflowMenuItemType } from 'react-native-ui-kitten/ui';
import { HeartIconFill, MoreHorizontalIconFill, MoreVerticalIconFill } from '@src/assets/icons';
import { PopoverPlacements, PopoverPlacement } from 'react-native-ui-kitten/ui/popover/type';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


interface ComponentProps {
  onSearch():void
}

type State = {

  menuVisible: boolean
}

export type LikeButtonProps = ThemedComponentProps & TouchableOpacityProps & ComponentProps;

class SearchPlaceholderComponent extends React.Component<LikeButtonProps, State> {

  public state: State = {
    menuVisible: false
  }



 
  public render(): React.ReactNode {
    const { style, themedStyle } = this.props;

    return (
      <TouchableWithoutFeedback style={[themedStyle.container,style]} onPress={()=>this.props.onSearch()}>
        <Text category="p2" appearance="hint">搜车牌号看车主</Text>
      </TouchableWithoutFeedback>
    );
  }
}



export const SearchPlaceholder = withStyles(SearchPlaceholderComponent, (theme: ThemeType) => ({
  container: {
    width: 250,
    borderRadius:5,
    padding:10,
    backgroundColor: theme['background-basic-color-2'],
  },

}));
