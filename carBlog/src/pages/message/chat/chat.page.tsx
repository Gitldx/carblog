import React from 'react';
import {
  NavigationScreenProps,
  NavigationScreenConfig, NavigationActions,
} from 'react-navigation';
import {
  ChatHeader,
  ChatHeaderNavigationStateParams,
} from './chatHeader.component';
import {

  Profile,
  MESSAGETYPE,
} from '@src/core/model';
// import { conversation5,conversation0 } from '@src/core/data/conversation';
// import {
//   profile1,
//   profile2,
// } from '@src/core/data/profile';
import { Chat1 } from './chat.component';
// import { imageProfile1 } from '@src/assets/images';
import { UserAccount } from '@src/core/userAccount/userAccount';
import EventRegister, { chatEvent, chatReadEvent } from '@src/core/uitls/eventRegister';
import { HomeMessage, ChatMessage } from '@src/core/model/message.model';
import { isEmpty, getTimestampStr, formatTimeStampStr } from '@src/core/uitls/common';
import { MessageLooper } from '@src/core/uitls/messageLooper';
import { getLocalChats, saveChats } from '@src/core/uitls/storage/messageStorage';
import { author1 } from '@src/core/data/articles';


interface State {
  newMessageText: string;
  // conversation: Conversation;
  talks: ChatMessage[],
  hasMore : boolean
}

export class ChatPage extends React.Component<NavigationScreenProps, State> {

  // private id: number;
  private chat;
  // private conversation: Conversation = conversation0
  private talksHistory : ChatMessage[] = []

  public state: State = {
    newMessageText: '',
    // conversation: null,
    talks: [],
    hasMore : true
  };

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const headerProps: ChatHeaderNavigationStateParams = {
      interlocutor: navigation.getParam('interlocutor'),
      // lastSeen: navigation.getParam('lastSeen', 'today'),
      onBack: navigation.getParam('onBack'),
      onProfile: navigation.getParam('onProfile'),
    };

    const header = (navigationProps: NavigationScreenProps) => {
      return (
        <ChatHeader
          {...navigationProps}
          {...headerProps}
        />
      );
    };

    return { ...navigation, ...screenProps, header };
  };




  // private setInitId() {
  //   const ids =this.conversation.messages.filter(m => !isNaN(m.id as any)).map(m => Number(m.id)) // //todo: 暂时先用id字段来测试 this.conversation.messages.filter(m => !isNaN(m.key as any)).map(m => Number(m.key))
  //   // console.warn(`this.id:${JSON.stringify(ids)}`)
  //   if (ids.length == 0) {
  //     this.id = 0;
  //     return;
  //   }
  //   const maxId = Math.max(...ids)

  //   this.id = isNaN(maxId) ? 0 : maxId + 1

  // }


  private listMessages = async () => {
    let msgs : ChatMessage[]= await getLocalChats(this.interlocutorId)
    this.talksHistory = msgs.map(m=>{return {id:m.id,type:m.type,title:m.title,content:m.content,senderId:m.senderId,senderName:m.senderName,strContent:m.strContent,date:formatTimeStampStr(m.id),chatType:m.chatType}})//msgs.map(m=>new Message(m.id,m.senderId,m.strContent,formatTimeStampStr(m.id),false))
    let start = this.talksHistory.length - this.pageSize
    start = start > 0 ? start : 0
    this.setState({ /* conversation: this.conversation, */ hasMore : start == 0 ? false : true,
      talks: this.talksHistory.slice(start, this.talksHistory.length) })

    // msgs = msgs.map((m : Message) => new Message(m.id, new User(m.senderId, m.sender), m.strContent, msgType.NORMAL))

    // this.messages.splice(0, 0, ...msgs)
    // this.setState({ talks: this.conversation.messages.slice(0, this.pageSize) })
    // removeLocalChat(this.talker.uid)
    EventRegister.emitEvent(chatReadEvent, { uid: this.interlocutorId })

    //this.setInitId()

  }


  private pageSize = 3;
  private getMore = () : boolean=> {

    const list: ChatMessage[] = this.state.talks;
    const first = list[0]
    // console.warn(first.text)

    if (first) {
      const index = this.talksHistory.findIndex(m => m.id == first.id) //todo: 暂时先用id字段来测试  this.conversation.messages.findIndex(m => m.key == first.key)
      const start = index - this.pageSize > 0 ? index - this.pageSize : 0
      const nextPage = this.talksHistory.slice(start, index)
      // console.warn(`index:${index},index - this.pageSize : ${index - this.pageSize},messages:${this.conversation.messages.map(elm => elm.text)}`)
      let hasMore = true
      if (!isEmpty(nextPage)) {

        this.chat.contentChangeByGetMore = true;
        // console.warn(`this.chat.contentChangeByGetMore:${this.chat.contentChangeByGetMore}`)

        const lastOfNextPage = nextPage[0]
        const index_lastOfNextPage = this.talksHistory.findIndex(m => m.id == lastOfNextPage.id)//todo: 暂时先用id字段来测试  list.findIndex(m => m.key == lastOfNextPage.key)
        if (index_lastOfNextPage == 0) {
          hasMore = false
        }

        const copy = Object.assign([], list)
        const newPages = nextPage.concat(copy)


        this.setState({ talks: newPages })
 
        return hasMore
      }
      else {
        return false
      }

    }
    else {
      return false
    }
  }



  private chatEventListener = null
  private registerMessageEvent = () => {

    this.chatEventListener = EventRegister.addEventListener(chatEvent, (data) => {

      let newMsg = (data.chats as HomeMessage[]).filter(m => m.senderId == this.interlocutorId)

      if (newMsg.length == 0) {
        return;
      }
      // console.warn(`registerMessageEvent0:${JSON.stringify(newMsg)}`)
      // console.warn(`registerMessageEvent1:${JSON.stringify(this.messages)}`)
      newMsg = newMsg.filter(m => {
        return this.state.talks.findIndex(c => c.id == m.id) == -1
      })
      // let newMsg = data.chats.filter((item) => {
      //     return item.type == MESSAGETYPE.user.chat
      // })

      if (newMsg.length == 0) {
        return;
      }
      // console.warn(`chat registerMessageEvent : ${JSON.stringify(newMsg)}`)
      newMsg.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        }
        else if (a.id < b.id) {
          return 1
        }
        else {
          return 0
        }
      })



      // console.warn(`chat registerMessageEvent:${JSON.stringify(newMsg)}`)
      const newChats : ChatMessage[] = newMsg.map((m) => {return {...m,date:formatTimeStampStr(m.id)}})
      // this.messages.splice(0, 0, ...newMsg)

      this.setState({ talks: this.state.talks.concat(newChats) })



      setTimeout(() => {
        EventRegister.emitEvent(chatReadEvent, { uid: this.interlocutorId })
      }, 0);
    })

  }



  private onProfilePress = (profile: Profile): void => {
    this.props.navigation.setParams({ 'interlocutor': { firstName: "ldx", lastName: "jyh", photo: author1.image } })
    this.props.navigation.navigate('Test Profile');
  };

  private onNewMessageChange = (newMessageText: string): void => {
    this.setState({ newMessageText });
  };

  private onMessageAddPress = (): void => {

    const ua : UserAccount = UserAccount.instance

    MessageLooper.instance.chat({receiverId:ua.id == "1" ? "2" : "1",message:this.state.newMessageText})
    
    // const profiles: Profile[] = [profile1, profile2];
    const msgId = getTimestampStr()//this.id++
    const chatMessage : ChatMessage = {id:msgId,type:MESSAGETYPE.user_chat,title:ua.accountName,
      content:this.state.newMessageText,senderId:ua.id,senderName:ua.accountName,strContent:this.state.newMessageText}
    saveChats(ua.id == "1" ? "2" : "1",[chatMessage])
    // const newMessage = new Message(msgId, profiles[Math.floor(Math.random() * profiles.length)], this.state.newMessageText, '15:01 PM', false)
    const newMessage : ChatMessage = {id:msgId,senderId:ua.id,strContent:this.state.newMessageText,type:MESSAGETYPE.user_chat,title:ua.accountName,content:this.state.newMessageText,date:formatTimeStampStr(msgId)}
    //new Message(msgId, UserAccount.instance.id, this.state.newMessageText, formatTimeStampStr(msgId), false)

    // const newMessage: Message = {
    //   author: profiles[Math.floor(Math.random() * profiles.length)],
    //   text: this.state.newMessageText,
    //   date: '15:01 PM',
    //   read: false,
    //   delivered: false,
    // };
    const talksHistoryCopy: ChatMessage[] = this.talksHistory;
    const copy = Array.from(this.state.talks);
    talksHistoryCopy.push(newMessage);
    copy.push(newMessage)
    // conversationCopy.messages.splice(0,0,copy[6])
    this.setState({
      // conversation: conversationCopy,
      newMessageText: '',
      talks: copy
    });
  };

  private onBackPress = (): void => {
    this.props.navigation.goBack(null);
  };

  private interlocutorId : string
  public componentWillMount(): void {
    this.interlocutorId = this.props.navigation.getParam("msgUid")
    // console.warn(`messages: ${JSON.stringify(this.conversation.messages.map(elm => elm.text))}`)
    // let start = this.talksHistory.length - this.pageSize
    // start = start > 0 ? start : 0
    // this.setState({ /* conversation: this.conversation, */ hasMore : start == 0 ? false : true,
    //   talks: this.talksHistory.slice(start, this.talksHistory.length) })
    this.listMessages()
    //this.setInitId()
    this.props.navigation.setParams({
      interlocutor: { nickname: "ldx", accountName: "jyh", photo: author1.image },
      // lastSeen: this.state.conversation.lastSeen,
      onBack: this.onBackPress,
      onProfile: this.onProfilePress,
    });
  }


  public componentWillUnmount():void{
    MessageLooper.instance.exitChat()
    EventRegister.removeEventListener(this.chatEventListener)
  }


  public componentDidMount() {
    MessageLooper.instance.startChat()
    this.registerMessageEvent()
  }

  public render(): React.ReactNode {
    return (
      <Chat1 ref = {ref => this.chat = ref}
        hasMore = {this.state.hasMore}
        // conversation={this.state.conversation}
        interlocutorId = {this.interlocutorId}
        talks={this.state.talks}
        newMessage={this.state.newMessageText}
        onNewMessageChange={this.onNewMessageChange}
        onMessageAdd={this.onMessageAddPress}
        getMore={this.getMore}
      />
    );
  }
}
