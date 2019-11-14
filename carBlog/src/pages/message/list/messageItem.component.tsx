import React from 'react';
import {
  ImageProps,
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  Animated,
} from 'react-native';
// import {
//   Conversation as ConversationModel,
//   Message,
// } from '@src/core/model';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { Text } from 'react-native-ui-kitten/ui';
import { textStyle } from '@src/components/common';
import { MessageIcon } from './messageIcon.component';
import { ConversationInterlocutor } from './conversationInterlocutor.component';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { HomeMessage } from '@src/core/model/message.model';
import { isEmpty } from '@src/core/uitls/common';
import { MessageStatus } from '../type';

interface ComponentProps {
  index?: number;
  message: HomeMessage;//ConversationModel;
  onConversation: (index: number) => void;
  // messageStatus : MessageStatus;
  deleteItem(index:number)
}

export type MessageProps = & ThemedComponentProps & TouchableOpacityProps & ComponentProps;

class MessageComponent extends React.Component<MessageProps> {

  private _swipeableRow;

  private onConversation = (): void => {
    this.props.onConversation(this.props.index);
  };

  private getLastMessageText = (): string => {
    const { message } = this.props;
    const lastMessage: string = message.strContent//conversation.messages[conversation.messages.length - 1].text;
    if(isEmpty(lastMessage)){
      return ""
    }
    return lastMessage.length <= 37 ? lastMessage : `${lastMessage.substring(0, 32)}...`;
  };

  private stamp2datetime(stamp : string) {
    const str = stamp.substr(4, 8);
    return str.substr(0, 2) + '-' + str.substr(2, 2) + " " + str.substr(4, 2) + ":" + str.substr(6, 2);
  }

  private getLastMessageDate = (): string => {
    const { message } = this.props;

    return this.stamp2datetime(message.id)//"08-23 15:35"//conversation.messages[conversation.messages.length - 1].date;
  };

  private renderLastMessageIcon = (item:HomeMessage): React.ReactElement<ImageProps> | null => {
    
    // const lastMessage: Message = conversation//conversation.messages[conversation.messages.length - 1];
    // console.warn(`renderLastMessageIcon:${JSON.stringify(item)}`)
    const messageStatus = item.read ? MessageStatus.READ : MessageStatus.UNREAD
    return (
      <MessageIcon readFlag={messageStatus}/>
    );
  };


  updateRef = ref => {
    this._swipeableRow = ref;
  };

  delete = () => {
    this._swipeableRow.close();
    this.props.deleteItem(this.props.index)
  };

  private renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
    });
    return (
      <RectButton onPress={this.delete} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: "red", paddingHorizontal: 20 }}>
        <Animated.Text
          style={[
            { alignItems: 'center', color: "white" },
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          删除
        </Animated.Text>
      </RectButton>
    );
  };

  public render(): React.ReactNode {
    const { themedStyle, style, message: conversation } = this.props;

    return (
      <Swipeable
        ref={this.updateRef}
        renderRightActions={this.renderLeftActions}>
        <TouchableOpacity
          activeOpacity={0.65}
          style={[themedStyle.container, style]}
          onPress={this.onConversation}>
          <View style={themedStyle.leftSection}>
            <ConversationInterlocutor
              style={themedStyle.avatar}
            // profile={conversation.interlocutor}
            />
            <View style={themedStyle.messageContainer}>
              <Text
                style={themedStyle.userLabel}
                category='s2'>
                {conversation.title}
              </Text>
              <Text
                style={themedStyle.lastMessageLabel}
                appearance='hint'
                category='c1'
                adjustsFontSizeToFit={true}>
                {this.getLastMessageText()}
              </Text>
            </View>
          </View>
          <View style={themedStyle.rightSection}>
            {this.renderLastMessageIcon(conversation)}
            <Text
              style={themedStyle.dateLabel}
              appearance='hint'
              category='p2'>
              {this.getLastMessageDate()}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  }
}

export const MessageItem = withStyles(MessageComponent, (theme: ThemeType) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  messageContainer: {
    // flex: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  userLabel: textStyle.subtitle,
  lastMessageLabel: textStyle.caption1,
  dateLabel: textStyle.paragraph,
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));
