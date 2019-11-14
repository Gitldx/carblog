
import { Alignments } from './type';
import { ChatMessage } from '@src/core/model/message.model';

interface UiMessage {
  alignment: Alignments;
}

export type UiMessageModel = UiMessage & ChatMessage;
