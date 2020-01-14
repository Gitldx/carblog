import React from 'react';
import {
  ImageProps,
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  Animated,
  StyleSheet,
  Image,
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
import { HomeMessage, ChatMessage } from '@src/core/model/message.model';
import { isEmpty } from '@src/core/uitls/common';
import { MessageStatus } from '../type';
import { MESSAGETYPE } from '@src/core/model';
import { MaterialCommunityIcons } from '@src/assets/icons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { themes } from '@src/core/themes';

interface ComponentProps {
  index?: number;
  message: HomeMessage//ChatMessage;//ConversationModel;
  onPressed: (index: number) => void;
  // messageStatus : MessageStatus;
  deleteItem(index: number)
}

export type MessageProps = & ThemedComponentProps & TouchableOpacityProps & ComponentProps;

class MessageComponent extends React.Component<MessageProps> {

  private _swipeableRow;

  private onPressed = (): void => {
    this.props.onPressed(this.props.index);
  };

  private getLastMessageText = (): string => {
    const { message } = this.props;
    const lastMessage: string = message.strContent//conversation.messages[conversation.messages.length - 1].text;
    if (isEmpty(lastMessage)) {
      return ""
    }
    return lastMessage.length <= 37 ? lastMessage : `${lastMessage.substring(0, 32)}...`;
  };

  private stamp2datetime(stamp: string) {
    const str = stamp.substr(4, 8);
    return str.substr(0, 2) + '-' + str.substr(2, 2) + " " + str.substr(4, 2) + ":" + str.substr(6, 2);
  }

  private getLastMessageDate = (): string => {
    const { message } = this.props;

    return this.stamp2datetime(message.id)//"08-23 15:35"//conversation.messages[conversation.messages.length - 1].date;
  };

  private renderLastMessageIcon = (item: HomeMessage): React.ReactElement<ImageProps> | null => {

    // const lastMessage: Message = conversation//conversation.messages[conversation.messages.length - 1];
    // console.warn(`renderLastMessageIcon:${JSON.stringify(item)}`)
    const messageStatus = item.read ? MessageStatus.READ : MessageStatus.UNREAD
    return (
      <MessageIcon readFlag={messageStatus} />
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
      <RectButton onPress={this.delete} style={{ justifyContent: 'center', alignItems: 'center', 
      backgroundColor: getThemeValue("color-danger-default",themes["App Theme"]), paddingHorizontal: 20 }}>
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


  private renderIcon(type) {
    switch (type) {
      case MESSAGETYPE.user_chat:
        return (
          <View style={[styles.icon, { backgroundColor: '#DDDDDD', justifyContent: 'center', alignItems: 'center' }]}>
            <Image style={{ position: 'absolute', left: 0, top: 0, width: 45, height: 45, zIndex: 2, borderRadius: 4 }} source={{ uri: avatarUrl(this.props.message.senderId) }} />
            <FontAwesome5Icon name='user' size={35} color='white' />
          </View>

        )

      case MESSAGETYPE.sys_bulletin:
        // console.warn(`bulletin:${JSON.stringify(this.props.message)}`)
        return (
          <View style={[styles.icon, { backgroundColor: '#f9a825', justifyContent: 'center', alignItems: 'center' }]}>
            {this.props.message.img ? 
            <Image style={{ /* position: 'absolute', left: 0, top: 0, */ width: 45, height: 45, /* zIndex: 2, */ borderRadius: 4 }} source={{ uri: this.props.message.img }} />
            :
            <MaterialCommunityIcons name="bell" size={35} color={'white'} />
          }
            
          </View>
        )

      case MESSAGETYPE.user_sysEmail:
        return (
          // <Image style={styles.icon} source={{ uri: 'http://img32.photophoto.cn/20140709/0046044459284152_s.jpg' }} />
          <View style={[styles.icon, { backgroundColor: '#4d73ff', justifyContent: 'center', alignItems: 'center' }]}>
            <MaterialCommunityIcons name="email" size={35} color={'white'} />
          </View>
        )
      case MESSAGETYPE.user_web:
        return (
          <View style={[styles.icon, { backgroundColor: '#DDDDDD', justifyContent: 'center', alignItems: 'center' }]}>
            {
              this.props.message.img ? 
              <Image style={{/*  position: 'absolute', left: 0, top: 0, */ width: 45, height: 45, /* zIndex: 2, */ borderRadius: 4 }} source={{ uri: this.props.message.img/* 'http://img32.photophoto.cn/20140709/0046044459284152_s.jpg' */ }} />
              :
              <MaterialCommunityIcons name="email" size={35} color={'white'} />
            }
            
          </View>
        )
      case MESSAGETYPE.user_park:
          return (
            // <Image style={styles.icon} source={{ uri: 'http://img32.photophoto.cn/20140709/0046044459284152_s.jpg' }} />
            <View style={[styles.icon, { backgroundColor: '#4d73ff', justifyContent: 'center', alignItems: 'center' }]}>
              <MaterialCommunityIcons name="parking" size={35} color={'white'} />
            </View>
          )
    }
  }

  private contentText(item) {
    switch (item.type) {
      case MESSAGETYPE.user_chat:
        return item.strContent;
      case MESSAGETYPE.user_park:
        return item.strContent;
      default:
        return item.content;
    }
  }

  public render(): React.ReactNode {
    const { themedStyle, style, message: p } = this.props;

    return (
      <Swipeable
        ref={this.updateRef}
        renderRightActions={this.renderLeftActions}>
        <TouchableOpacity
          activeOpacity={0.65}
          style={[themedStyle.container, style]}
          onPress={this.onPressed}>
          <View style={styles.container}>

            {this.renderIcon(p.type)}
            <View style={{ paddingHorizontal: 5, paddingVertical: 3, flex: 1 }}>
              <View style={{ paddingHorizontal: 5, paddingVertical: 3, flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={themedStyle.messageTitle}>{p.title}</Text>
                </View>
                <View>
                  <Text style={{ color: '#999999', fontSize: 12 }}>{this.stamp2datetime(p.id)}</Text>
                </View>


              </View>
              <View style={{ paddingHorizontal: 5, paddingVertical: 3 }}>
                <Text style={{ color: '#666666', fontSize: 13 }}>{this.contentText(p)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  }

  public render0(): React.ReactNode {
    const { themedStyle, style, message: conversation } = this.props;

    return (
      <Swipeable
        ref={this.updateRef}
        renderRightActions={this.renderLeftActions}>
        <TouchableOpacity
          activeOpacity={0.65}
          style={[themedStyle.container, style]}
          onPress={this.onPressed}>
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",

    paddingHorizontal: 5,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.054)',
    alignItems: 'center'
  },
  icon: {
    width: 45, height: 45, marginLeft: 5, borderRadius: 4
  }
})

export const MessageItem = withStyles(MessageComponent, (theme: ThemeType) => ({
  container: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // padding: 16,
  },
  messageTitle:{
    color:theme["text-basic-color"],
    fontSize: 14
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
