import { MESSAGETYPE } from './messageType.enum';


// export interface Message {
//   id : string,
//   author: Profile;
//   text?: string;
//   file?: File;
//   date: string;
//   read: boolean;
//   delivered: boolean;
// }

// export class Message {
//   public key?: string
//   constructor(public id: string | number, public authorId: string, public text: string,
//     public date: string, public read: boolean) {
//     this.key = id.toString()
//   }
// }



// export class HomeMessage {
//   public key?: string
//   constructor(public id: string, public type: MESSAGETYPE, public title: string,
//     public content: any, public senderId?: string, public senderName?: string,
//     public strContent?: string, public chatType?: number, public read?: boolean) {

//     this.key = id
//   }
// }



export class ChatMessage {
  public date?: string
  public key?: string
  constructor(public id: string, public type: MESSAGETYPE, public title: string,
    public content: any, public senderId?: string, public senderName?: string,
    public strContent?: string, public chatType?: number, public read?: boolean) {

    this.key = id
  }
}


export interface WebMessage {
  id: string
  type: MESSAGETYPE
  url: string
  img: string
  title: string
  content: string
  read?: boolean
}


export interface ParkMessage{
  id: string
  type: MESSAGETYPE
  senderId: string,
  senderName: string,
  title: string
  content: any
  strContent:string
  read?: boolean
}


export type HomeMessage = WebMessage | ChatMessage
