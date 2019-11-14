import React from 'react';
import {
  ButtonProps,
  ImageProps,
  View,
} from 'react-native';
import {
  StyleType,
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { Button } from 'react-native-ui-kitten/ui';

// import { ProfilePhoto } from '@src/components/social';
import {
  ScrollableAvoidKeyboard,
  textStyle,
} from '@src/components/common';
// import { PlusIconFill } from '@src/assets/icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SignUpFormData } from './type';
import { SignUpForm } from './signUpForm.component';
import { NavigationScreenProps } from 'react-navigation';
import { postService, userAccountRegisterUrl } from '@src/core/uitls/httpService';
import { UserAccount } from '@src/core/userAccount/userAccount';

interface ComponentProps {
  // onSignUpPress: (formData: SignUpFormData) => void;
  // onSignInPress: () => void;
  // onPhotoPress: () => void;
}

export type SignUp2Props = ThemedComponentProps & ComponentProps & NavigationScreenProps;

interface State {
  formData: SignUpFormData;
}

class SignUp2Component extends React.Component<SignUp2Props, State> {

  static navigationOptions = ({ navigation, screenProps }) => {
    return {

      title: '注册'
    }
  }

  public state: State = {
    formData: undefined,
  };

  private onFormDataChange = (formData: SignUpFormData) => {
    this.setState({ formData });
  };

  private onPhotoButtonPress = () => {
    // this.props.onPhotoPress();
  };

  private onSignInButtonPress = () => {
    // this.props.onSignInPress();
    this.props.navigation.navigate("SignIn")
    // this.props.navigation.navigate("MyInfo")
  };

  private onSignUpButtonPress = async () => {
    // this.props.onSignUpPress(this.state.formData);
    const {accountName,password,role} = this.state.formData

    UserAccount.instance.register(accountName,password,role,()=>{

    })

    // const result = await postService(userAccountRegisterUrl(),{accountName,password,role} )
    // console.warn(JSON.stringify(result))
  };

  // private renderPhotoButtonIcon = (style: StyleType): React.ReactElement<ImageProps> => {
  //   const { themedStyle } = this.props;

  //   return PlusIconFill({ ...style, ...themedStyle.photoButtonIcon });
  // };

  // private renderPhotoButton = (): React.ReactElement<ButtonProps> => {
  //   const { themedStyle } = this.props;

  //   return (
  //     <Button
  //       style={themedStyle.photoButton}
  //       activeOpacity={0.95}
  //       icon={this.renderPhotoButtonIcon}
  //       onPress={this.onPhotoButtonPress}
  //     />
  //   );
  // };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;

    return (
      <ScrollableAvoidKeyboard style={themedStyle.container}>
        {/* <View style={themedStyle.headerContainer}>
          <ProfilePhoto
            style={themedStyle.photo}
            resizeMode='center'
            source={{ uri: 'https://akveo.github.io/eva-icons/fill/png/128/person.png' }}
            button={this.renderPhotoButton}
          />
        </View> */}
        <SignUpForm
          style={themedStyle.formContainer}
          onDataChange={this.onFormDataChange}
        />
        <Button
          style={themedStyle.signUpButton}
          textStyle={textStyle.button}
          size='medium'
          disabled={!this.state.formData}
          onPress={this.onSignUpButtonPress}>
          注册
        </Button>
        <Button
          style={themedStyle.signInButton}
          textStyle={themedStyle.signInText}
          appearance='ghost'
          activeOpacity={0.75}
          onPress={this.onSignInButtonPress}>
          已有账号？点击此处登录
        </Button>
      </ScrollableAvoidKeyboard>
    );
  }
}

export const SignUpPage = withStyles(SignUp2Component, (theme: ThemeType) => ({
  container: {
    flex: 1,
    // backgroundColor: ['background-basic-color-1'],
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 216,
    backgroundColor: theme['color-primary-default'],
  },
  formContainer: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  photo: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignSelf: 'center',
    backgroundColor: theme['background-basic-color-1'],
    tintColor: theme['color-primary-default'],
  },
  photoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    transform: [{ translateY: 80 }],
    borderColor: theme['border-basic-color-2'],
    backgroundColor: theme['background-basic-color-2'],
  },
  photoButtonIcon: {
    width: 24,
    height: 24,
    tintColor: theme['color-primary-default'],
  },
  signUpButton: {
    marginHorizontal: 16,
  },
  signInButton: {
    marginVertical: 12,
  },
  signInText: {
    color: theme['text-hint-color'],
    ...textStyle.subtitle,
  },
}));

