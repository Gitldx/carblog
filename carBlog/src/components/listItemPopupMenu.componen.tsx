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
  onItemSelect(index: number,data : any): void
  data : any
}

type State = {

  menuVisible: boolean
}

export type Props = ThemedComponentProps & TouchableOpacityProps & ComponentProps


class ListItemPopupMenuComponent extends React.Component<Props, State> {

  public state: State = {
    menuVisible: false
  }


  private data : any
  constructor(props:Props){
    super(props)
    this.data = props.data
  }



  private onBackdropPress = () => {
    this.setState({ menuVisible: false });
  };

  private onItemSelect = (index) => {
    this.props.onItemSelect(index,this.data)
    this.setState({ menuVisible: false });
  };

  private onButtonPress = () => {

    this.setState({ menuVisible: true });
  };

  public render(): React.ReactNode {
    const { style, themedStyle, items, iconColor = "primary", orientaion = "vertical", placement = PopoverPlacements.LEFT_START } = this.props;

    return (
      <OverflowMenu
        style={themedStyle.container}
        placement={placement}
        visible={this.state.menuVisible}
        items={items}
        onSelect={this.onItemSelect}
        onBackdropPress={this.onBackdropPress}>
        <Button appearance="ghost" status={iconColor} icon={orientaion == "horizontal" ? MoreHorizontalIconFill : MoreVerticalIconFill} onPress={this.onButtonPress}></Button>
      </OverflowMenu>
    );
  }
}



export const ListItemPopupMenu = withStyles(ListItemPopupMenuComponent, (theme: ThemeType) => ({
  container: {
    width: 228,
    backgroundColor: theme['background-basic-color-2'],
  },

}));
