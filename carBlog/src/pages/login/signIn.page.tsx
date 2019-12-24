import React from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  Button,
  Text,
} from 'react-native-ui-kitten/ui';

import {
  ScrollableAvoidKeyboard,
  textStyle,
} from '@src/components/common';
import { View } from 'react-native';
import { SignInForm } from './signInForm.component';
import { SignInFormData } from './type';
import { NavigationScreenConfig } from 'react-navigation';
import { NavigationScreenProps } from 'react-navigation';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';
import { networkConnected } from '@src/core/uitls/netStatus';
import { showNoNetworkAlert, showOngoingAlert } from '@src/core/uitls/common';
import { removeCityCode } from '@src/core/uitls/storage/locationStorage';
import debounce from '@src/core/uitls/debounce'
import { hideMessage } from 'react-native-flash-message';

interface ComponentProps {
  onSignInPress: (formData: SignInFormData) => void;
  onSignUpPress: () => void;
  onForgotPasswordPress: () => void;
}

export type SignIn2Props = ThemedComponentProps & ComponentProps & NavigationScreenProps;

interface State {
  formData: SignInFormData | undefined;
}

class SignInComponent extends React.Component<SignIn2Props> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    return {

      title: '登录'
    }
  }

  public state: State = {
    formData: undefined,
  };

  private onSignInButtonPress = debounce(()=>{
    showOngoingAlert("正在登录...")
    this.onSignInButtonPressAction()
  },3000,true)


  private onSignInButtonPressAction = () => {
    if(!networkConnected()){
      showNoNetworkAlert()
      return;
    }
    const {username,password} = this.state.formData
    UserAccount.loginWithAccount(username,password,(data:any)=>{
      if(data == false){
        return
      }
      removeCityCode()
      hideMessage()
      setTimeout(() => {
        this.props.navigation.navigate("MyHome")
      }, 0);
    })
    //this.props.onSignInPress(this.state.formData);
  };

  private onSignUpButtonPress = () => {
    // this.props.onSignUpPress();
    this.props.navigation.navigate({routeName:"SignUp"})
  };

  private onForgotPasswordButtonPress = () => {
    this.props.onForgotPasswordPress();
  };

  private onFormDataChange = (formData: SignInFormData) => {
    this.setState({ formData });
  };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;

    return (
      <ScrollableAvoidKeyboard style={themedStyle.container}>
        <View style={themedStyle.headerContainer}>
          <Text
            style={themedStyle.helloLabel}
            category='h1'>
            欢迎使用
          </Text>
          <Text
            style={themedStyle.signInLabel}
            category='s1'>
            请登录你的账号
          </Text>
        </View>
        <SignInForm
          style={themedStyle.formContainer}
          onForgotPasswordPress={this.onForgotPasswordButtonPress}
          onDataChange={this.onFormDataChange}
        />
        <Button
          style={themedStyle.signInButton}
          textStyle={textStyle.button}
          size='medium'
          disabled={!this.state.formData}
          onPress={this.onSignInButtonPress}>
          登录
        </Button>
        <Button
          style={themedStyle.signUpButton}
          textStyle={themedStyle.signUpText}
          appearance='ghost'
          activeOpacity={0.75}
          onPress={this.onSignUpButtonPress}>
          没有账号？现在创建一个
        </Button>
      </ScrollableAvoidKeyboard>
    );
  }
}

export const SignInPage = withStyles(SignInComponent, (theme: ThemeType) => {
  return ({
    container: {
      flex: 1,
      // backgroundColor: theme['background-basic-color-1'],
    },
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 216,
      // backgroundColor: theme['color-primary-default'],
    },
    formContainer: {
      flex: 1,
      marginTop: 32,
      paddingHorizontal: 16,
    },
    helloLabel: {
      // color: 'white',
      ...textStyle.headline,
    },
    signInLabel: {
      marginTop: 16,
      // color: 'white',
      ...textStyle.subtitle,
    },
    signInButton: {
      marginHorizontal: 16,
    },
    signUpButton: {
      marginVertical: 12,
    },
    signUpText: {
      color: theme['text-hint-color'],
      ...textStyle.subtitle,
    },
  });
});

