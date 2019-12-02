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


interface ComponentProps {
  placement?: PopoverPlacement
  iconColor?: "primary" | "success"
  orientaion?: "horizontal" | "vertical"
  items: OverflowMenuItemType[]
  onItemSelect(index: number): void
  customButton?: (onPress: () => void) => React.ReactElement
}

type State = {

  menuVisible: boolean
}

export type LikeButtonProps = ThemedComponentProps & TouchableOpacityProps & ComponentProps;

class PopupMenuComponent extends React.Component<LikeButtonProps, State> {

  public state: State = {
    menuVisible: false
  }



  private onBackdropPress = () => {
    this.setState({ menuVisible: false });
  };

  private onItemSelect = (index) => {
    this.props.onItemSelect(index)
    this.setState({ menuVisible: false });
  };

  private onButtonPress = () => {

    this.setState({ menuVisible: true });
  };

  public render(): React.ReactNode {
    const { style, themedStyle, items, iconColor = "primary", orientaion = "vertical", placement = PopoverPlacements.LEFT_START, customButton } = this.props;

    return (
      <OverflowMenu
        style={themedStyle.container}
        placement={placement}
        visible={this.state.menuVisible}
        data={items}
        onSelect={this.onItemSelect}
        onBackdropPress={this.onBackdropPress}>
        {
          customButton ? customButton(this.onButtonPress) :
            <Button appearance="ghost" status={iconColor} icon={orientaion == "horizontal" ? MoreHorizontalIconFill : MoreVerticalIconFill}
              onPress={this.onButtonPress}></Button>
        }

      </OverflowMenu>
     
    );
  }
}



export const PopupMenu = withStyles(PopupMenuComponent, (theme: ThemeType) => ({
  container: {
    width: 228,
    backgroundColor: theme['background-basic-color-2'],
  },

}));
