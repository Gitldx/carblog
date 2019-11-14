import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  TopNavigationActionProps,
  TopNavigationAction,
  TopNavigation,
} from 'react-native-ui-kitten/ui';
import { SafeAreaView } from '@src/core/navigation';
import {
  ArrowIosBackFill,
  SearchIconOutline,
} from '@src/assets/icons';
import { ThemeService } from '@src/core/themes';

interface ComponentProps {
  onBack: () => void;
  onSearchPress: () => void;
}

export type ConversationListHeaderProps = ThemedComponentProps & ComponentProps & NavigationScreenProps;

class MessageListHeaderComponent extends React.Component<ConversationListHeaderProps> {

  private onSearchPress = (): void => {
    this.props.onSearchPress();
  };

  private onBack = (): void => {
    this.props.onBack();
  };

  private renderLeftControl = (): React.ReactElement<TopNavigationActionProps> => {
    return (
      <TopNavigationAction
        icon={ArrowIosBackFill}
        onPress={this.onBack}
      />
    );
  };

  private renderRightControls = (): React.ReactElement<TopNavigationActionProps>[] => {
    return ([
      <TopNavigationAction
        icon={SearchIconOutline}
        onPress={this.onSearchPress}
      />,
    ]);
  };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;

    return (
      <SafeAreaView style={themedStyle.container}>
        <TopNavigation
          alignment='center'
          title='消息'
          // leftControl={this.renderLeftControl()}
          rightControls={this.renderRightControls()}
          style = {{backgroundColor:'transparent'}}
        />
      </SafeAreaView>
    );
  }
}

export const MessageListHeader = withStyles(MessageListHeaderComponent, (theme: ThemeType) => ({
  container: {
    backgroundColor: ThemeService.getPrimaryColor()//theme['background-basic-color-1'],
  },
}));

