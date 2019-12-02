// import React from 'react';
// import { NavigationScreenProps } from 'react-navigation';
// import { View, Text } from 'react-native';
// import { ConversationsListContainer } from './conversationsList/conversationsList.container';


// export class MessagesContainer extends React.Component<NavigationScreenProps> {


//   public render(): React.ReactNode {
//     return (
//         <ConversationsListContainer navigation = {this.props.navigation} {...this.props.navigationOptions} {...this.props.screenProps}/>
//     );
//   }
// }

import React from 'react';
import {
  NavigationScreenProps,
  NavigationScreenConfig,
} from 'react-navigation';

import { MessageList } from './messageList.component';
import { TopNavigationElement } from '@src/core/navigation/options';
import { MessageListHeader } from './messageList.header';
import { HomeMessage, ChatMessage, WebMessage, ParkMessage } from '@src/core/model/message.model';
import { MessageLooper } from '@src/core/uitls/messageLooper';
import EventRegister, { homeMessageEvent, loginEvent, initAppUserStateCompleteEvent, chatReadEvent, homeMessageReadEvent } from '@src/core/uitls/eventRegister';
import { getLocalMsgs, saveMsgs, unreadMsgKey, readMsgKey, saveChats, removeOneChat } from '@src/core/uitls/storage/messageStorage';
import { onlineAccountState, hasInitAppUserState } from '@src/core/userAccount/functions';
import { MESSAGETYPE } from '@src/core/model';
import { simpleAlert } from '@src/core/uitls/alertActions';
import { getService, getProfileUrl, RestfulJson } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';


interface ConversationsListNavigationStateParams {
  onBack: () => void;
  onSearchPress: () => void;
}

interface State {
  searchEnabled: boolean;
  messages: HomeMessage[]//Conversation[];
  searchText: string
}



export class MessagesPage extends React.Component<NavigationScreenProps, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const conversationHeaderConfig: ConversationsListNavigationStateParams = {
      onBack: navigation.getParam('onBack'),
      onSearchPress: navigation.getParam('onSearchPress'),
    };

    const renderHeader = (headerProps: NavigationScreenProps,
      config: ConversationsListNavigationStateParams) => {

      return (
        <MessageListHeader
          {...headerProps}
          onSearchPress={config.onSearchPress}
          onBack={config.onBack}
        />
      );
    };

    return {
      ...navigation,
      ...screenProps,
      header: (headerProps: NavigationScreenProps): TopNavigationElement => {
        return renderHeader(headerProps, conversationHeaderConfig);
      },
    };
  };


  private messageLists: React.Component;


  private listMessages = async () => {
    const localMsgs = await getLocalMsgs()
    // console.warn(`listMessages:${JSON.stringify(localMsgs)}`)

    let unreadMessages: HomeMessage[] = [], readMessages: HomeMessage[] = [];

    const onlineState = onlineAccountState()

    if (onlineState == 0) {
      // unreadMessages = isEmpty(localMsgs.unreads) ? [] : localMsgs.unreads//localMsgs.unreads.filter(msg => msg.type == MESSAGETYPE.sys.bulletin)
      // readMessages = isEmpty(localMsgs.reads) ? [] : localMsgs.reads//localMsgs.reads.filter(msg => msg.type == MESSAGETYPE.sys.bulletin)
    }
    else {
      unreadMessages = localMsgs.unreads
      readMessages = localMsgs.reads
    }

    MessageLooper.unReadMessage = unreadMessages
    MessageLooper.readMessage = readMessages

    //  console.warn(`listmessage:${JSON.stringify(readMessages)},unreads:${JSON.stringify(unreadMessages)}`)
    const allMsgs = unreadMessages.concat(readMessages)
    // console.warn(`allMsgs:${JSON.stringify(allMsgs)}`)
    this.setState({ messages: allMsgs })
  }

  public componentWillMount(): void {
    this.props.navigation.setParams({
      onSearchPress: this.onSearchPress,
      onBack: this.onBackPress,
    });


  }


  public componentDidMount(): void {
    EventRegister.addEventListener(homeMessageEvent, () => {
      // console.warn(`un:${JSON.stringify(MessageLooper.unReadMessage)}`)
      const unReadMessages = MessageLooper.unReadMessage;
      const readMsgs = MessageLooper.readMessage;
      // console.warn(`un:${JSON.stringify(MessageLooper.unReadMessage)},read:${JSON.stringify(readMsgs)}`)
      const allMsgs = unReadMessages.concat(readMsgs)
      this.setState({ messages: allMsgs })
    })

    if (hasInitAppUserState()) {
      this.listMessages()
    }
    else {
      EventRegister.addEventListener(initAppUserStateCompleteEvent, () => {
        this.listMessages()
      })
    }

    EventRegister.addEventListener(loginEvent, data => {
      if (data.accountHasLogined) {

        this.listMessages()
      }
    })


    EventRegister.addEventListener(chatReadEvent, ({ uid }) => {
      const index = this.state.messages.findIndex((m: ChatMessage) => m.senderId == uid)
      const msg: ChatMessage = this.state.messages[index]
      if (msg.read == false) {
        msg.read = true
        MessageLooper.unReadMessage.splice(index, 1)
        MessageLooper.readMessage = [msg].concat(MessageLooper.readMessage)
        saveMsgs(MessageLooper.unReadMessage, unreadMsgKey)
        saveMsgs(MessageLooper.readMessage, readMsgKey)
        const allMsgs = MessageLooper.unReadMessage.concat(MessageLooper.readMessage)

        this.setState({ messages: allMsgs }, () => {
          EventRegister.emitEvent(homeMessageReadEvent)
        })
      }
    })

  }



  public state: State = {
    // conversations: MessageLooper.unReadMessage.map(elm => new HomeMessage("0",MESSAGETYPE.user_chat,elm.interlocutor.firstName+elm.interlocutor.lastName,elm.messages[elm.messages.length - 1].text)),//conversations,
    messages: [],//MessageLooper.unReadMessage.map(elm => new HomeMessage(elm.id, MESSAGETYPE.user_chat, elm.title, elm.strContent, elm.senderId, elm.senderName, elm.strContent)),//conversations,
    searchEnabled: false,
    searchText: ""
  };

  private navigationKey: string = 'ConversationsListContainer';

  private onBlur = () => {
    this.setState({ searchEnabled: false })

  }

  private onBackPress = (): void => {
    this.props.navigation.goBack(null);
  };

  private onSearchPress = (): void => {
    const visible = this.state.searchEnabled
    this.setState({ searchEnabled: !visible }, () => {
      if (!visible) {
        (this.messageLists as any).focusInput();
      }
    });
  };


  private gotoUserPage = (uid:string) => {
    
    getService(getProfileUrl(uid)).then((rj:RestfulJson)=>{
      const ua : UserAccount = rj.data
      this.props.navigation.navigate("UserBlog", { ua })
    })
    
}

  private onPressed = (index: number) => {
    const msg: HomeMessage = this.state.messages[index]
    // console.warn(`onConversationPress:${JSON.stringify(msg)}`)
    if (!msg.read) {
      msg.read = true
      MessageLooper.unReadMessage.splice(index, 1)
      MessageLooper.readMessage = [msg].concat(MessageLooper.readMessage)
      saveMsgs(MessageLooper.unReadMessage, unreadMsgKey)
      saveMsgs(MessageLooper.readMessage, readMsgKey)
      const allMsgs = MessageLooper.unReadMessage.concat(MessageLooper.readMessage)

      this.setState({ messages: allMsgs }, () => {
        EventRegister.emitEvent(homeMessageReadEvent)
      })
    }

    switch (msg.type) {
      case MESSAGETYPE.user_chat:
        this.props.navigation.navigate({
          key: this.navigationKey,
          routeName: 'Chat 1',
          params: { msgUid: (msg as ChatMessage).senderId }
        });
        break;
      case MESSAGETYPE.user_web:
        this.props.navigation.navigate({
          routeName: "Web",
          params: { url: (msg as WebMessage).url }
        })
        break;
      case MESSAGETYPE.sys_bulletin:

        if ((msg as any).url) {
          this.props.navigation.navigate({
            routeName: "Web",
            params: { url: (msg as WebMessage).url }
          })
        }
        else {
          simpleAlert("公告", msg.content)
        }
        break;
      case MESSAGETYPE.user_park:
        // alert((msg as ParkMessage).strContent)
        this.gotoUserPage((msg as ParkMessage).senderId)
        break;
    }



  }

  private deleteItem = (index: number) => {
    const item = this.state.messages[index]

    if (item.read == true) {
      MessageLooper.readMessage.splice(index - MessageLooper.unReadMessage.length,1)
      saveMsgs(MessageLooper.readMessage, readMsgKey)
      
    }
    else {
      MessageLooper.unReadMessage.splice(index, 1)
      saveMsgs(MessageLooper.unReadMessage, unreadMsgKey)
      EventRegister.emitEvent(homeMessageReadEvent)
    }

    if (item.type == MESSAGETYPE.user_chat) {
      removeOneChat((item as ChatMessage).senderId)
    }

    const allMsgs = MessageLooper.unReadMessage.concat(MessageLooper.readMessage)
    // console.warn(JSON.stringify(allMsgs))
    this.setState({ messages: allMsgs })

  }

  private onSearchStringChange = (searchString: string): void => {
    if (searchString && searchString.length) {
      const query: string = searchString.toUpperCase();
      const items: HomeMessage[] = this.state.messages
        .filter((item: HomeMessage) => {
          const name: string = item.title.toUpperCase();// `${item.interlocutor.firstName} ${item.interlocutor.lastName}`.toUpperCase();
          return name.includes(query);
        });
      this.setState({ searchText: searchString, messages: items });
    } else {
      // this.setState({ searchText: searchString, messages: MessageLooper.unReadMessage });
    }
  };




  public render(): React.ReactNode {
    return (
      
      <MessageList ref={ref => this.messageLists = ref}
        searchEnabled={this.state.searchEnabled}
        searchText={this.state.searchText}
        messages={this.state.messages}
        onSearchStringChange={this.onSearchStringChange}
        onPressed={this.onPressed}
        deleteItem={this.deleteItem}
        onSearchInputBlur={this.onBlur}
      />
    );
  }
}

