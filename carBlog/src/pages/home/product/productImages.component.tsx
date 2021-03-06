import React from 'react';
import {
  Image,
  ListRenderItemInfo,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  List,
  ListItem,
  ListItemProps,
  ListProps,
} from 'react-native-ui-kitten/ui';
import { ImageSource } from '@src/assets/images';

// @ts-ignore (`renderItem` prop override)
interface ComponentProps extends ListProps {
  data: ImageSource[];
  onItemPress?: (index: number) => void;
  renderItem?: (info: ListRenderItemInfo<ImageSource>) => ListItemElement;
}

export type Props = ThemedComponentProps & ComponentProps;

type ListItemElement = React.ReactElement<ListItemProps>;

class ProductImagesComponent extends React.Component<Props> {

  private onItemPress = (index: number) => {
    if (this.props.onItemPress) {
      this.props.onItemPress(index);
    }
  };

  private renderItem = (info: ListRenderItemInfo<ImageSource>): ListItemElement => {
    const { themedStyle } = this.props;

    return (
      <ListItem
        style={themedStyle.itemContainer}
        activeOpacity={0.75}
        onPress={this.onItemPress}>
        <Image
          style={themedStyle.item}
          source={info.item.imageSource}
        />
      </ListItem>
    );
  };

  public render(): React.ReactNode {
    const { contentContainerStyle, themedStyle, data, ...restProps } = this.props;

    return (
      <List
        {...restProps}
        contentContainerStyle={[themedStyle.container, contentContainerStyle]}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={this.renderItem}
      />
    );
  }
}

export const ProductImages = withStyles(ProductImagesComponent, (theme: ThemeType) => ({
  container: {
    overflow: 'hidden',
  },
  itemContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  item: {
    width: 180,
    height: 120,
  },
}));
