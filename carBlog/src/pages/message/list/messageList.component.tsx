import React from 'react';
import {
  View,
  ListRenderItemInfo
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  List,
  Input,
  InputProps,
  Text
} from 'react-native-ui-kitten/ui';
import {
  MessageItem,
  MessageProps,
} from './messageItem.component';

import { SearchIconOutline } from '@src/assets/icons';
import { textStyle } from '@src/components/common';
import { HomeMessage, WebMessage } from '@src/core/model/message.model';
import { MESSAGETYPE } from '@src/core/model';


interface ComponentProps {
  searchEnabled: boolean;
  searchText: string,
  messages: HomeMessage[]//ConversationModel[];
  onSearchStringChange: (text: string) => void;
  onPressed: (index: number) => void;
  deleteItem(index: number);
  onSearchInputBlur: () => void
}

export type MessageListProps = ThemedComponentProps & ComponentProps;

class MessageListComponent extends React.Component<MessageListProps> {

  private input: React.Component;

  private onPressed = (index: number): void => {
    this.props.onPressed(index);
  };

  private deleteItem = (index: number) => {
    this.props.deleteItem(index)
  }

  private onSearchStringChange = (text: string): void => {
    this.props.onSearchStringChange(text);
  };

  private renderItem = (info: ListRenderItemInfo<HomeMessage>): React.ReactElement<MessageProps> => {
    const { themedStyle } = this.props;
    const {item} = info
    // if(info.item.type == MESSAGETYPE.user_chat){
      
      return (
        <MessageItem
          style={themedStyle.item}
          message={item}
          index={info.index}
          onPressed={this.onPressed}
          deleteItem={this.deleteItem}
        // messageStatus = {MessageStatus.UNREAD}
        />
      );
    // }
    // else if(item.type == MESSAGETYPE.user_web){
    //   return(
    //     <View>
    //       <Text>{(item as WebMessage).url}</Text>
    //     </View>
    //   )
    // }


  };

  // private renderReadItem = (info: ListRenderItemInfo<HomeMessage>): React.ReactElement<MessageProps> => {
  //   const { themedStyle } = this.props;

  //   return (
  //     <MessageItem
  //       style={themedStyle.item}
  //       message={info.item}
  //       index={info.index}
  //       onConversation={this.onConversation}
  //       messageStatus = {MessageStatus.READ}
  //     />
  //   );
  // };

  private renderSearchInput = (): React.ReactElement<InputProps> | null => {
    const { themedStyle, searchEnabled } = this.props;

    return searchEnabled ? (
      <Input ref={ref => this.input = ref}
        size="small"
        style={themedStyle.input}
        textStyle={[textStyle.paragraph, { paddingVertical: 0 }]}
        icon={SearchIconOutline}
        placeholder='搜索名字...'
        onChangeText={this.onSearchStringChange}
        onBlur={this.props.onSearchInputBlur}
      />
    ) : null;
  };

  public render(): React.ReactNode {
    const { themedStyle, messages: conversations } = this.props;

    return (
      <View style={themedStyle.container}>
        {this.renderSearchInput()}
        <List
          // style={themedStyle.container}
          data={conversations}
          renderItem={this.renderItem}
        />
        {/* <List
          // style={themedStyle.container}
          data={conversations}
          renderItem={this.renderReadItem}
        /> */}
      </View>
    );
  }


  public focusInput(): void {
    (this.input as any).focus();
  }

}

/**
 * 消息列表首页
 */
export const MessageList = withStyles(MessageListComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-2'],
  },
  item: {
    backgroundColor: theme['background-basic-color-1'],
    marginVertical: 0.5,
  },
  input: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
}));

