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



export class HomeMessage {
  public key?: string
  constructor(public id: string, public type: MESSAGETYPE, public title: string,
    public content: any, public senderId?: string, public senderName?: string,
    public strContent?: string, public chatType?: number, public read?: boolean) {
    
      this.key = id
  }
}



export interface ChatMessage extends HomeMessage {
  date?: string
}

