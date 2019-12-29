import React from 'react';
import {
  View,
  TouchableOpacity,
  ImageProps,
} from 'react-native';
import {
  ListItem,
  ListItemProps,
  ListProps,
  Text,
} from 'react-native-ui-kitten/ui';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  textStyle,
} from '@src/components/common';
// import { MoreHorizontalIconFill } from '@src/assets/icons';
import { Comment as CommentModel } from '@src/core/model';
// import { CommentList2 } from '../commentList2';
// import { ArticleActivityBar } from '../articleActivityBar.component';
import {ActivityAuthoring} from './activityAuthoring.component'
import { CommentsButton } from '../commentsButton.component';
import { LikeButton } from '../likeButton.component';
import { thumbnailUri } from '@src/assets/images/type';
import { isEmpty } from '@src/core/uitls/common';


interface ComponentProps {
  comment: CommentModel;
  navigation : any;
  // onMorePress: (index: number) => void;
  onLikePress: (index: number) => void;
  onReplyMorePress: (index: number) => void;
}

interface State {
  repliesVisible: boolean;
}

export type CommentListItemProps = & ThemedComponentProps & ListItemProps & ComponentProps;

type RepliesElement = React.ReactElement<ListProps>;

class CommentListItemComponent extends React.Component<CommentListItemProps, State> {

  public state: State = {
    repliesVisible: false,
  };

  // private onMorePress = () => {
  //   this.props.onMorePress(this.props.index);
  // };

 

  private onLikePress = () => {
    this.props.onLikePress(this.props.index);
  };

  private onCommentPress = () => {
    const repliesVisible: boolean = !this.state.repliesVisible;

    this.setState({ repliesVisible });
  };

  // private onReplyMorePress = (index: number) => {
  //   this.props.onReplyMorePress(index);
  // };

  private shouldRenderReplies = (): boolean => {
    const { comment } = this.props;

    return false //comment.comments && comment.comments.length !== 0 && this.state.repliesVisible;
  };

  // private renderMoreIcon = (): React.ReactElement<ImageProps> => {
  //   const { themedStyle } = this.props;

  //   return MoreHorizontalIconFill(themedStyle.moreIcon);
  // };

  private renderReplyList = (): RepliesElement => {
    const { themedStyle, comment } = this.props;

    return (
      <View></View>
      // <CommentList2
      //   style={themedStyle.repliesList}
      //   data={comment.comments}
      //   onItemMorePress={this.onReplyMorePress}
      // />
    );
  };

  public render(): React.ReactNode {
    const { style, themedStyle, comment } = this.props;

    const repliesElement: RepliesElement | null = this.shouldRenderReplies() && this.renderReplyList();

    return (
      <ListItem style={[themedStyle.container, style]}>
        
        <View style={themedStyle.authorContainer}>
          <ActivityAuthoring
            navigation ={this.props.navigation}
            profile = {comment.authorProfile}
            style={themedStyle.activityAuthoring}
            photo={!isEmpty(comment.authorProfile.image)? thumbnailUri(comment.authorProfile.image) : null}
            name={comment.authorProfile.nickname}
            date={comment.dateString}
          />
          {/* <TouchableOpacity
            activeOpacity={0.75}
            onPress={this.onMorePress}>
            {this.renderMoreIcon()}
          </TouchableOpacity> */}
        </View>
        <Text
          style={themedStyle.commentLabel}
          category='s1'>
          {comment.text}
        </Text>
        {/* <ArticleActivityBar
          style={themedStyle.activityContainer}
          comments={comment.comments ? comment.comments.length : 0}
          likes={comment.likesCount}
          onCommentPress={this.onCommentPress}
          onLikePress={this.onLikePress}
        /> */}
        <View style={{flexDirection:'row',marginTop: 24,}}>
          {/* <CommentsButton onPress={this.onCommentPress}>
            {comment.comments ? comment.comments.length.toString() : "0"}
          </CommentsButton> */}
          <LikeButton style={{marginLeft:10}} canAction={true} onPress={this.onLikePress}>
            {comment.likes ? comment.likes.length.toString() : "0"}
          </LikeButton>
        </View>
        {repliesElement}
      </ListItem>
    );
  }
}

export const CommentList1Item = withStyles(CommentListItemComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityContainer: {
    marginTop: 24,
  },
  activityAuthoring: {
    flex: 1,
  },
  commentLabel: {
    marginLeft: 8,
    marginRight: 32,
    marginTop: 14,
    ...textStyle.paragraph,
  },
  moreIcon: {
    width: 18,
    height: 18,
    tintColor: theme['text-hint-color'],
  },
  repliesList: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
}));
