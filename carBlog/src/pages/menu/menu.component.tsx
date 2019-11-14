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

interface ComponentProps {
  selectedIndex: number;
  onTabSelect: (index: number) => void;
}

type Props = ThemedComponentProps & ComponentProps;

class MenuComponent extends React.Component<Props> {

  private onTabSelect = (index: number) => {
    this.props.onTabSelect(index);
  };

  public render(): React.ReactNode {
    const { selectedIndex, themedStyle } = this.props;

    return (
      <SafeAreaView style={themedStyle.safeAreaContainer}>
        <ThemeProvider theme={{ ...this.props.theme, ...themes['App Theme'] }}>
          <BottomNavigation
            appearance='noIndicator'
            selectedIndex={selectedIndex}
            onSelect={this.onTabSelect}
            style={{backgroundColor:"transparent"}}
            >
            <TabButton style={{ alignItems: 'center' }} lable="首页">
              <MaterialCommunityIcons name="home" size={30} />
            </TabButton>
            <TabButton style={{ alignItems: 'center' }} lable="消息" badge={"2"}>
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
