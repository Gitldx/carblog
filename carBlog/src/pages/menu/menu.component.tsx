import React from 'react';
import { SafeAreaView } from '@src/core/navigation/';
import {
  ThemeProvider,
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  BottomNavigation,
  BottomNavigationTab,
} from 'react-native-ui-kitten/ui';
import {
  MaterialCommunityIcons
} from '@src/assets/icons';
import { themes } from '@src/core/themes';
import { TabButton } from './tabButton.component';
import EventRegister, { messageEvent, chatEvent, homeMessageEvent, loginEvent, homeMessageReadEvent, initAppUserStateCompleteEvent } from '@src/core/uitls/eventRegister';
import { HomeMessage, MESSAGETYPE, ChatMessage } from '@src/core/model';
import { MessageLooper } from '@src/core/uitls/messageLooper';
import { isEmpty } from '@src/core/uitls/common';
import { saveChats, saveMsgs, unreadMsgKey, readMsgKey, getLocalMsgs } from '@src/core/uitls/storage/messageStorage';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { hasInitAppUserState, onlineAccountState } from '@src/core/userAccount/functions';

interface ComponentProps {
  selectedIndex: number;
  onTabSelect: (index: number) => void;
}

type Props = ThemedComponentProps & ComponentProps;

interface State {
  unreadsNumber: number,
}

class MenuComponent extends React.Component<Props, State> {


  public state: State = {
    unreadsNumber: 0
  }


  private onTabSelect = (index: number) => {
    this.props.onTabSelect(index);
  };



  private async processNewChats(unreads: ChatMessage[] = [], reads: ChatMessage[] = [], newMsg: ChatMessage[] = []) {
    const chats = newMsg.filter(m => m.type == MESSAGETYPE.user_chat)
    const uids = new Set(chats.map(m => m.senderId))

    for (const uid of uids) {
      const msgsOfUid = chats.filter(m => m.senderId == uid)
      // console.warn("processNewChats" + JSON.stringify(msgsOfUid))

      await saveChats(uid, msgsOfUid)

      const newestOne = msgsOfUid[0]
      if (msgsOfUid.length == 1) {

      }
      else {
        msgsOfUid.forEach((v, i) => {
          if (i != 0) {
            const indexOfUnreads = unreads.findIndex(m => m.id == msgsOfUid[i].id)
            unreads.splice(indexOfUnreads, 1)
          }
        })
      }

      const indexOfOntherUnread = unreads.findIndex(m => m.type == MESSAGETYPE.user_chat && m.senderId == uid && m.id != newestOne.id)
      if (indexOfOntherUnread != -1) {
        unreads.splice(indexOfOntherUnread, 1)
      }


      const indexOfRead = reads.findIndex(m => m.type == MESSAGETYPE.user_chat && m.senderId == uid)
      if (indexOfRead != -1) {
        reads.splice(indexOfRead, 1)
      }

    }


    EventRegister.emitEvent(chatEvent, { chats })

  }


  private registerMessageEvent = (): void => {
    EventRegister.addEventListener(messageEvent, async (data: HomeMessage[]) => {

      // Vibration.vibrate(300)  //todo:加权限

      const localMsg = await getLocalMsgs()

      let unreads: HomeMessage[] = localMsg.unreads//Object.assign([], MessageLooper.unReadMessage)

      const newMsg = data.filter((item: HomeMessage) => {
        return unreads.findIndex(elm => elm.id == item.id) == -1; //unreads.every((elm)=>elm.id != item.id)
      })

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


      // if (!this.hasConfigPushNotification && newMsg.some((i) => i.type != MESSAGETYPE.sys.bulletin)) {
      //     this.hasConfigPushNotification = true
      //     configNotification(this.props.navigator)
      // }

      if (!isEmpty(newMsg)) {
        const one = newMsg[0]
        // console.warn("one:" + JSON.stringify(newMsg))
        if (one.type == MESSAGETYPE.user_chat) {
          // PushNotification.localNotificationSchedule({
          //     id: new Date() - new Date('1970/01/01 00:00:00'),
          //     title: '您有新的消息',
          //     message: one.title,
          //     date: new Date(Date.now() + 1 * 1000),
          //     userInfo: { type: 1 }
          // });
        }
      }




      unreads = newMsg.concat(unreads)
      const reads: HomeMessage[] = localMsg.reads//Object.assign([], MessageLooper.readMessage)
      await this.processNewChats(unreads, reads, newMsg)

      // unreads.forEach(m=>m.read == false)
      // reads.forEach(m=>m.read=true)

      // console.warn(`msgEvent:${JSON.stringify(unreads)},reads:${JSON.stringify(reads)}`)

      saveMsgs(unreads, unreadMsgKey)
      saveMsgs(reads, readMsgKey)

      MessageLooper.unReadMessage = unreads
      MessageLooper.readMessage = reads


      this.setState({ unreadsNumber: unreads.length })

      EventRegister.emitEvent(homeMessageEvent)


    })


    EventRegister.addEventListener(loginEvent, () => {
      if (UserAccount.instance.accountHasLogined) {

        getLocalMsgs().then(msgs => {
          const unreads = msgs.unreads
          // console.warn(`unreads:${JSON.stringify(unreads)}`)
          this.setState({ unreadsNumber: unreads.length })
        })
      }
      else {
        getLocalMsgs().then(msgs => {
          const unreads = msgs.unreads.filter(m => m.type == MESSAGETYPE.sys_bulletin)
          // console.warn(`unreads:${JSON.stringify(unreads)}`)
          this.setState({ unreadsNumber: unreads.length })
        })
      }

    })


    EventRegister.addEventListener(homeMessageReadEvent, () => {
      this.setState({ unreadsNumber: MessageLooper.unReadMessage.length })
    })


    EventRegister.addEventListener(initAppUserStateCompleteEvent,()=>{
      const state = onlineAccountState()
      if (state == 1 || state == 2) {
        getLocalMsgs().then(msgs => {
          const unreads = msgs.unreads

          this.setState({ unreadsNumber: unreads.length })
        })
      }
      else{
        getLocalMsgs().then(msgs => {
          const unreads = msgs.unreads.filter(m=>m.type == MESSAGETYPE.sys_bulletin)

          this.setState({ unreadsNumber: unreads.length })
        })
      }
    })

  }


  public componentDidMount() {
    this.registerMessageEvent()

    // if (hasInitAppUserState()) {
    //   const state = onlineAccountState()
    //   if (state == 1 || state == 2) {
    //     getLocalMsgs().then(msgs => {
    //       const unreads = msgs.unreads

    //       this.setState({ unreadsNumber: unreads.length })
    //     })
    //   }
    //   else{
    //     getLocalMsgs().then(msgs => {
    //       const unreads = msgs.unreads.filter(m=>m.type == MESSAGETYPE.sys_bulletin)

    //       this.setState({ unreadsNumber: unreads.length })
    //     })
    //   }
    // }
  }


  public render(): React.ReactNode {
    const { selectedIndex, themedStyle } = this.props;

    return (//todo:为什么程序一开始会显示消息badge
      <SafeAreaView style={themedStyle.safeAreaContainer}>
        <ThemeProvider theme={{ ...this.props.theme, ...themes['App Theme'] }}>
          <BottomNavigation
            appearance='noIndicator'
            selectedIndex={selectedIndex}
            onSelect={this.onTabSelect}
            style={{ backgroundColor: "transparent" }}
          >
            <TabButton style={{ alignItems: 'center' }} lable="首页">
              <MaterialCommunityIcons name="home" size={30} />
            </TabButton>
            <TabButton style={{ alignItems: 'center' }} lable="消息" badge={this.state.unreadsNumber.toString()}>
              <MaterialCommunityIcons name="email" size={30} />

            </TabButton>
            <TabButton style={{ alignItems: 'center' }} lable="我的">
              <MaterialCommunityIcons name="account" size={30} />

            </TabButton>
          </BottomNavigation>
        </ThemeProvider>
      </SafeAreaView>
    );
  }
}

export const Menu = withStyles(MenuComponent, (theme: ThemeType) => ({
  safeAreaContainer: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));
