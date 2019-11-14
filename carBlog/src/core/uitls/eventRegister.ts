

const initAppUserStateCompleteEvent: string = "initAppUserStateCompleteEvent"
const initAppOnlineCompleteEvent: string = 'initAppOnlineCompleteEvent'
const messageEvent: string = "messageEvent"
const homeMessageEvent: string = "homeMessageEvent"
const homeMessageReadEvent:string="homeMessageReadEvent"
const newFriendEvent: string = 'newFriendEvent'
const loginEvent: string = 'loginEvent'
const chatEvent: string = 'chatEvent'
const chatReadEvent: string = 'chatReadEvent'


class EventRegister {//todo:unmount

  static _Listeners = {
    count: 0,
    refs: {},
  }

  static addEventListener(eventName: string, callback: (any) => void): string | false {
    if (
      typeof eventName === 'string' &&
      typeof callback === 'function'
    ) {
      EventRegister._Listeners.count++
      const eventId: string = 'l' + EventRegister._Listeners.count
      EventRegister._Listeners.refs[eventId] = {
        name: eventName,
        callback,
      }
      return eventId
    }
    return false
  }

  static removeEventListener(id: string): boolean {
    if (typeof id === 'string') {
      return delete EventRegister._Listeners.refs[id]
    }
    return false
  }

  static removeAllListeners(): boolean {
    let removeError = false
    Object.keys(EventRegister._Listeners.refs).forEach(_id => {
      const removed = delete EventRegister._Listeners.refs[_id]
      removeError = (!removeError) ? !removed : removeError
    })
    return !removeError
  }

  static emitEvent(eventName: string, data?: {}): void {
    Object.keys(EventRegister._Listeners.refs).forEach(_id => {
      if (
        EventRegister._Listeners.refs[_id] &&
        eventName === EventRegister._Listeners.refs[_id].name
      )
        EventRegister._Listeners.refs[_id].callback(data);
    })
  }

  /*
   * shortener
   */
  //   static on(eventName, callback) {
  //     return EventRegister.addEventListener(eventName, callback)
  //   }

  //   static rm(id) {
  //     return EventRegister.removeEventListener(id)
  //   }

  //   static rmAll() {
  //     return EventRegister.removeAllListeners()
  //   }

  //   static emit(eventName, data) {
  //     EventRegister.emitEvent(eventName, data)
  //   }

}



export default EventRegister
export {
  initAppUserStateCompleteEvent,
  initAppOnlineCompleteEvent,
  messageEvent,
  homeMessageEvent,
  homeMessageReadEvent,
  newFriendEvent,
  loginEvent,
  chatEvent,
  chatReadEvent,
}