import React from 'react';
import {
  View,
  StatusBar,
  ViewProps,
  StatusBarStyle,
  Platform,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from  'react-native-ui-kitten/theme';
import { Layout } from 'react-native-ui-kitten';

interface ComponentProps{
    children : any
}


export type Props = ThemedComponentProps & ViewProps & ComponentProps;

export class PageView extends React.Component<Props> {


  public render(): React.ReactNode {
    

    return (
        <Layout level="3" {...this.props}>
            {this.props.children}
        </Layout>
    );
  }
}

