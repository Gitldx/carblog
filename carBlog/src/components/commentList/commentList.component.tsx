import React from 'react';
import {
  ListRenderItemInfo,
  View,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  List,
  ListProps,
} from 'react-native-ui-kitten/ui';
import { Comment } from '@src/core/model';
import {
  CommentList1Item,
  CommentListItemProps,
} from './commentListItem.component';


// @ts-ignore (override `renderItem` prop)
interface ComponentProps extends ListProps {
  navigation: any;
  data: Comment[];
  onLikePress: (index: number) => void;
  // onMorePress: (index: number) => void;
  onReplyMorePress: (index: number) => void;
  renderItem?: (info: ListItemElementInfo) => ListItemElement;
}

export type CommentsList1Props = ThemedComponentProps & ComponentProps;

type ListItemElement = React.ReactElement<CommentListItemProps>;
type ListItemElementInfo = ListRenderItemInfo<Comment>;

class CommentList1Component extends React.Component<CommentsList1Props> {

  private onItemMorePress = (index: number) => {
    // this.props.onMorePress(index);
  };



  private onItemLikePress = (index: number) => {
    this.props.onLikePress(index);
  };

  private onItemReplyMorePress = (index: number) => {
    this.props.onReplyMorePress(index);
  };

  private isLastItem = (index: number): boolean => {
    const { data } = this.props;

    return data.length - 1 === index;
  };

  private renderListItemElement = (comment: Comment, index: number): ListItemElement => {
    const { themedStyle } = this.props;

    return (
      <CommentList1Item
        navigation={this.props.navigation}
        style={[themedStyle.item, this.isLastItem(index) ? null : themedStyle.itemBorder]}
        comment={comment}
        onLikePress={() => this.onItemLikePress(comment.index)}
        // onMorePress={this.onItemMorePress}
        onReplyMorePress={this.onItemReplyMorePress}
      />
    );
  };

  private renderItem = (info: ListItemElementInfo): ListItemElement => {
    const { themedStyle } = this.props;
    const { item, index } = info;

    const listItemElement: ListItemElement = this.renderListItemElement(item, index);

    // const additionalStyle: ViewStyle = this.isLastItem(index) ? null : themedStyle.itemBorder;

    return listItemElement
    // return React.cloneElement(listItemElement, {
    //   style: [listItemElement.props.style, additionalStyle],
    // });
  };

  public render(): React.ReactNode {
    const { contentContainerStyle, themedStyle, ...restProps } = this.props;

    return (
      <List style={themedStyle.list}
        {...restProps}
        renderItem={this.renderItem}
      />
    );
  }
}

export const CommentsList = withStyles(CommentList1Component, (theme: ThemeType) => ({
  list: {
    backgroundColor: theme['background-basic-color-1'],
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme['border-basic-color-3'],
  },
}));

