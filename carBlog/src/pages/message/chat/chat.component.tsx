import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  Button,
  ButtonProps,
  Input,
  List,
  Text
} from 'react-native-ui-kitten/ui';
import {
  Alignments,
} from './type';
import{ChatMessage,ChatMessageProps} from './chatMessage.component'
import {
  // MicIconFill,
  PaperPlaneIconFill,
  // PlusIconFill,
} from '@src/assets/icons';

import { UiMessageModel } from './uiMessage.model';
import {
  AvoidKeyboard,
  textStyle,
} from '@src/components/common';
import { StringValidator } from '@src/core/validators';
import EarlierLoader from './earlierLoader';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { ChatMessage as ChatMessageModel } from '@src/core/model/message.model';




interface ComponentProps {
  // conversation: ConversationModel;
  interlocutorId : string;
  talks: ChatMessageModel[]//Message[];
  newMessage: string;
  hasMore: boolean,
  onNewMessageChange: (text: string) => void;
  onMessageAdd: () => void;
  getMore(): boolean
}

export type Chat1ComponentProps = ThemedComponentProps & ComponentProps;

class Chat1Component extends React.Component<Chat1ComponentProps> {

  private listRef: React.RefObject<FlatList<any>> = React.createRef();

  public contentChangeByGetMore: boolean = false
  private onListContentSizeChange = (): void => {
    // console.warn(`Chat1Component.contentChangeByGetMore:${this.contentChangeByGetMore}`)
    if (this.contentChangeByGetMore == true) {
      setTimeout(() => {
        this.contentChangeByGetMore = false;
      }, 1000);
      return;
    }
    setTimeout(() => this.listRef.current.scrollToEnd({ animated: true }), 0);
  };

  private onNewMessageChange = (text: string): void => {
    this.props.onNewMessageChange(text);
  };



  private onMessageAdd = (): void => {
    this.props.onMessageAdd();
  };

  private shouldRenderSendButton = (): boolean => {
    const { newMessage } = this.props;

    return StringValidator(newMessage);
  };

  private createUiMessages = (): UiMessageModel[] => {
    const {  talks } = this.props;

    return talks.map((message: ChatMessageModel) => {
      // if (message.author === profile1) {
        const uid = UserAccount.instance.id
        if (message.senderId != uid) {
        return {
          ...message,
          alignment: Alignments['ROW-LEFT'],
        };
      } else{ //if (message.authorId === "1") {//else if (message.author === profile2) {
        return {
          ...message,
          alignment: Alignments['ROW-RIGHT'],
        };
      }
    });
  };

  private renderMessage = (info: ListRenderItemInfo<UiMessageModel>): React.ReactElement<ChatMessageProps> => {
    const { themedStyle } = this.props;

    return (
      <ChatMessage
        style={themedStyle.message}
        index={info.index}
        message={info.item}
        alignment={info.item.alignment}
      />
    );
  };

  private renderSendMessageButton = (): React.ReactElement<ButtonProps> => {
    const { themedStyle } = this.props;

    return (
      <Button
        style={themedStyle.addMessageButton}
        appearance='ghost'
        size='large'
        icon={PaperPlaneIconFill}
        onPress={this.onMessageAdd}
      />
    );
  };

  private keyboardOffset = (height: number) => {
    return Platform.select({
      ios: height,
      android: 0,
    });
  };

  private subTitleText = (content): React.ReactElement => {
    return (
      <Text category="c1" style={{ marginRight: 5, textAlignVertical: 'center' }}>
        {content}
      </Text>
    )
  }

  private renderSubTile = () => {
    return (
      <React.Fragment>
        {this.subTitleText('大类')}
        {this.subTitleText('*')}
        {this.subTitleText('小类')}
        {this.subTitleText('|')}
        {this.subTitleText('轮次')}
      </React.Fragment>
    )
  }

  private renderEarlierLoader = () => {
    return (
      <View>

        {/* <View style={{ backgroundColor: "white", marginBottom: 10, borderWidth: 2, borderRadius: 20, borderColor: ThemeService.getPrimaryColor() }}>
          <ContentBox titleLabel="卓越民宿" titleInfo="苏州" subTitle={this.renderSubTile} description="skljfsdkfjsdkjgsdgjjjsghfsjdhfjsdhgjksdhhhjkjsdgfjsdkjs" />
          <AvatarContentBoxComponent style={{borderTopWidth: 1, borderTopColor: "lightgrey",paddingTop:16,paddingHorizontal:16}} imageSource={imageProfile1.imageSource}>
            <Text category="p1">林煎饼  |  CEO</Text>
          </AvatarContentBoxComponent>
        </View> */}

        <EarlierLoader hasMore={this.props.hasMore} getMore={this.props.getMore} />

      </View>
    )
  }


  public render(): React.ReactNode {
    const { themedStyle, newMessage } = this.props;

    const sendMessageButtonElement = this.shouldRenderSendButton() ? this.renderSendMessageButton() : null;

    return (
      <AvoidKeyboard
        style={themedStyle.container}
        autoDismiss={false}
        offset={this.keyboardOffset}>
        <List
          ref={this.listRef}
          contentContainerStyle={themedStyle.chatContainer}
          data={this.createUiMessages()}
          onContentSizeChange={this.onListContentSizeChange}
          renderItem={this.renderMessage}
          ListHeaderComponent={this.renderEarlierLoader}
        />
        <View style={themedStyle.inputContainer}>
          {/* <Button
            style={themedStyle.addMessageButton}
            textStyle={textStyle.button}
            icon={PlusIconFill}
            onPress={this.onMessageAdd}
          /> */}
          <Input
            // icon={MicIconFill}
            style={themedStyle.messageInput}
            textStyle={{ ...textStyle.paragraph, paddingVertical: 0 }}
            value={newMessage}
            placeholder='输入消息...'
            onChangeText={this.onNewMessageChange}
            multiline={true}
          />
          {sendMessageButtonElement}
        </View>
      </AvoidKeyboard>
    );
  }
}

export const Chat1 = withStyles(Chat1Component, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: {
    marginVertical: 12,
  },
  inputContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme['background-basic-color-1'],
  },
  addMessageButton: {
    width: 26,
    height: 26,
    borderRadius: 26,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 8,
  },
}));

