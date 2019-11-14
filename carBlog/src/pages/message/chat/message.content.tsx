import React from 'react';
import { ViewProps } from 'react-native';
import { LeftMessage } from './leftMessage.component';
import { RightMessage } from './rightMessage.component';
import { Alignments } from './type';
import { ChatMessage } from '@src/core/model/message.model';

export type MessageElement = React.ReactElement<ViewProps>;

interface MessageContent {
  view(message: ChatMessage, children?: React.ReactElement<any>[]): MessageElement;
}

const messageContents: { [key in Alignments]: MessageContent } = {
  [Alignments['ROW-LEFT']]: {
    view(message: ChatMessage, children?: React.ReactElement<any>[]): MessageElement {
      return (
        <LeftMessage message={message}>
          {children}
        </LeftMessage>
      );
    },
  },
  [Alignments['ROW-RIGHT']]: {
    view(message: ChatMessage, children?: React.ReactElement<any>[]): MessageElement {
      return (
        <RightMessage message={message}>
          {children}
        </RightMessage>
      );
    },
  },
};

export function getMessageContent(alignment: Alignments) {
  return messageContents[alignment];
}
