import React from 'react';
import { ImageProps } from 'react-native';
import {
  ThemeType,
  withStyles,
  ThemedComponentProps,
  StyleType,
} from 'react-native-ui-kitten/theme';
import { DoneAllIconOutline } from '@src/assets/icons';

import { MessageStatus } from '../type';

interface MessageIconProvider {
  icon(style: StyleType): React.ReactElement<ImageProps>;
}

// export enum MessageIcons {
//   READ = 'read',
//   DELIVERED = 'delivered',
// }



const messageIcons: { [key in MessageStatus]: MessageIconProvider } = {
  [MessageStatus.UNREAD]: {
    icon(style: StyleType): React.ReactElement<ImageProps> {
      return DoneAllIconOutline([style.messageIndicatorIcon, style.messageIndicatorIconRead]);
    },
  },
  [MessageStatus.READ]: {
    icon(style: StyleType): React.ReactElement<ImageProps> {
      return DoneAllIconOutline([style.messageIndicatorIcon, style.messageIndicatorIconDelivered]);
    },
  },
};

interface ComponentProps {
  // message: Message;
  readFlag : MessageStatus//'unread' | 'read'
}

type MessageIconProps = ThemedComponentProps & ComponentProps;

export class MessageIconComponent extends React.Component<MessageIconProps> {

  private defineMessageStatus(): MessageStatus | null {
    // if (read) {
    //   return MessageIcons.READ;
    // } else if (delivered && !read) {
    //   return MessageIcons.DELIVERED;
    // } else {
    //   return null;
    // }
    return this.props.readFlag
  }

  public render(): React.ReactElement<ImageProps> {
    const { themedStyle } = this.props;

    const messageStatus: MessageStatus = this.defineMessageStatus();
    const iconProvider: MessageIconProvider = messageIcons[messageStatus];

    return iconProvider ? iconProvider.icon(themedStyle) : null;
  }
}

export const MessageIcon = withStyles(MessageIconComponent, (theme: ThemeType) => ({
  messageIndicatorIcon: {
    width: 13,
    height: 8,
    marginRight: 4,
  },
  messageIndicatorIconRead: {
    tintColor: theme['color-danger-default'],//theme['color-primary-default'],
  },
  messageIndicatorIconDelivered: {
    tintColor: theme['text-hint-color'],
  },
}));
