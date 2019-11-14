import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  Avatar,
  AvatarProps,
  TopNavigation,
  TopNavigationAction,
  TopNavigationActionProps,
  TopNavigationProps,
  Layout,
  Text,
} from 'react-native-ui-kitten/ui';
import { ArrowIosBackFill, PersonIconFill } from '@src/assets/icons';
import { SafeAreaView } from '@src/core/navigation';
import { Profile } from '@src/core/model';
import { author1 } from '@src/core/data/articles';
// import { imageProfile1 } from '@src/assets/images';

interface ComponentProps {
  interlocutor: Profile;
  lastSeen?: string;
  onBack: () => void;
  onProfile: (profile: Profile) => void;
}

export interface ChatHeaderNavigationStateParams {
  interlocutor: Profile;
  lastSeen?: string;
  onBack: () => void;
  onProfile: (profile: Profile) => void;
}

export type ChatHeaderProps = ThemedComponentProps & ComponentProps & NavigationScreenProps;

class ChatHeaderComponent extends React.Component<ChatHeaderProps> {

  private onBack = (): void => {
    this.props.onBack();
  };

  private onProfile = (): void => {
    const { interlocutor, onProfile } = this.props;

    onProfile(interlocutor);
  };

  private renderLeftControl = (): React.ReactElement<TopNavigationActionProps> => {
    return (
      <TopNavigationAction
        icon={ArrowIosBackFill}
        onPress={this.onBack}
      />
    );
  };

  private renderProfileAvatar = (): React.ReactElement<AvatarProps> => {
    const { interlocutor } = this.props;

    return (
      // <Avatar source={interlocutor.photo.imageSource}/>
      <Avatar source={author1.avatar.imageSource}/>
    );
  };

  private renderRightControls = (): React.ReactElement<TopNavigationActionProps> => {
    const { themedStyle } = this.props;

    return (
      <TopNavigationAction
        icon={this.renderProfileAvatar}
        onPress={this.onProfile}
      />
    );
  };

  private renderInterlocutorProps = (): TopNavigationProps | null => {
    const { interlocutor } = this.props;

    return interlocutor && {
      title: `${interlocutor.nickname} ${interlocutor.accountName}`,
      // subtitle: `Last seen ${lastSeen}`,
      rightControls: this.renderRightControls(),
    };
  };

  public render(): React.ReactNode {
    const { themedStyle, interlocutor } = this.props;

    return (
      <SafeAreaView style={themedStyle.container}>
        <TopNavigation
          alignment='center'
          leftControl={this.renderLeftControl()}
          {...this.renderInterlocutorProps()}
        />
      </SafeAreaView>
    );
  }
}

export const ChatHeader = withStyles(ChatHeaderComponent, (theme: ThemeType) => ({
  container: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));

