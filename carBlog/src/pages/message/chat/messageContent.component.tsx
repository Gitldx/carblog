import React from 'react';
import { ViewProps } from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { Text } from 'react-native-ui-kitten/ui';
import { textStyle } from '@src/components/common';
import { ChatMessage } from '@src/core/model/message.model';

interface ComponentProps {
  message: ChatMessage;
  children?: React.ReactNode;
}

export type MessageContentProps = ThemedComponentProps & ViewProps & ComponentProps;

class MessageContentComponent extends React.Component<MessageContentProps> {

  public render(): React.ReactNode {
    const { themedStyle, message, children } = this.props;

    if (message.strContent) {
      return (
        <Text
          style={themedStyle.messageLabel}>
          {message.strContent}
        </Text>
      );
    } else if (children) {
      return children;
    } else {
      return null;
    }

  }
}

export const MessageContent = withStyles(MessageContentComponent, (theme: ThemeType) => ({
  messageLabel: {
    color: 'white',
    ...textStyle.paragraph,
  },
}));
