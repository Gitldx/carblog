import React from 'react';
import {
  View,
  ViewProps,
} from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { CheckBox, Radio,Text } from 'react-native-ui-kitten/ui';
import {
  textStyle,
  ValidationInput,
} from '@src/components/common';
import {
  // EmailIconFill,
  EyeOffIconFill,
  PersonIconFill,
} from '@src/assets/icons';
import {
  EmailValidator,
  NameValidator,
  PasswordValidator,
} from '@src/core/validators';
import { SignUpFormData } from './type';
import { AccountRoleType } from '@src/core/userAccount/type';
import { isEmpty } from '@src/core/uitls/common';


interface ComponentProps {
  /**
   * Will emit changes depending on validation:
   * Will be called with form value if it is valid, otherwise will be called with undefined
   */
  onDataChange: (value: SignUpFormData | undefined) => void;
}

export type SignUpForm2Props = ThemedComponentProps & ViewProps & ComponentProps;

interface State {
  accountName: string | undefined;
  email: string | undefined;
  password: string | undefined;
  password2 :string | undefined;
  passwordIdentical: boolean | undefined;
  termsAccepted: boolean;
  role : AccountRoleType;
  roleHint : string
}

class SignUpFormComponent extends React.Component<SignUpForm2Props, State> {

  public state: State = {
    accountName: undefined,
    email: undefined,
    password: undefined,
    password2: undefined,
    passwordIdentical: undefined,
    termsAccepted: false,
    role : 0,
    roleHint : ""
  };

  public componentDidUpdate(prevProps: SignUpForm2Props, prevState: State) {
    const oldFormValid: boolean = this.isValid(prevState);
    const newFormValid: boolean = this.isValid(this.state);

    const isStateChanged: boolean = this.state !== prevState;
    const becomeValid: boolean = !oldFormValid && newFormValid;
    const becomeInvalid: boolean = oldFormValid && !newFormValid;
    const remainValid: boolean = oldFormValid && newFormValid;

    if (becomeValid) {
      this.props.onDataChange(this.state);
    } else if (becomeInvalid) {
      this.props.onDataChange(undefined);
    } else if (isStateChanged && remainValid) {
      this.props.onDataChange(this.state);
    }
  }



  private onUsernameInputTextChange = (accountName: string) => {
    this.setState({ accountName: accountName });
  };


  private onPasswordInputValidationResult = (password: string) => {
    const { password2 } = this.state
    let identical = undefined
    if (!isEmpty(password2)) {
      if (password == password2) {
        identical == true
      }
      else {
        identical = false
      }
    }
    this.setState({ password, passwordIdentical: identical });
  };



  private onPassword2InputValidationResult = (password2: string) => {
    const { password } = this.state
    let identical = undefined
    if (!isEmpty(password)) {
      if (password == password2) {
        identical == true
      }
      else {
        identical = false
      }
    }
    this.setState({ password2, passwordIdentical: identical });
  };


  private isValid = (value: SignUpFormData): boolean => {
    const { accountName, password ,password2,role} = value;

    return accountName !== undefined
      && password !== undefined
      && password2 !== undefined
      && password == password2
      && role !=0
    // && email !== undefined
    // && termsAccepted;
  };


  private onRadioChecked = (value:AccountRoleType) => {
    const hint1 = "车主可以写博客，留停车电话,寻找和分享空车位"
    const hint2 = "行人可以读博客，勾搭车主，分享车位"
    this.setState({ role: value,roleHint : value == 1 ? hint1 : hint2 })
  }


  public render(): React.ReactNode {
    const { style, themedStyle, ...restProps } = this.props;

    const {role,roleHint,passwordIdentical} = this.state

    return (
      <View
        style={[themedStyle.container, style]}
        {...restProps}>
        <View style={themedStyle.formContainer}>
          <ValidationInput
            style={themedStyle.usernameInput}
            textStyle={textStyle.paragraph}
            autoCapitalize='none'
            placeholder='用户名'
            icon={PersonIconFill}
            validator={NameValidator}
            onChangeText={this.onUsernameInputTextChange}
          />
          {/* <ValidationInput
            style={themedStyle.emailInput}
            textStyle={textStyle.paragraph}
            autoCapitalize='none'
            placeholder='Email'
            icon={EmailIconFill}
            validator={EmailValidator}
            onChangeText={this.onEmailInputTextChange}
          /> */}
          <ValidationInput
            caption={passwordIdentical == false ? "密码不相同" : null}
            style={themedStyle.passwordInput}
            textStyle={textStyle.paragraph}
            autoCapitalize='none'
            secureTextEntry={true}
            placeholder='请输入密码,至少6位数字和字母的组合'
            icon={EyeOffIconFill}
            validator={PasswordValidator}
            onChangeText={this.onPasswordInputValidationResult}
          />

          <ValidationInput
            style={themedStyle.passwordInput}
            textStyle={textStyle.paragraph}
            autoCapitalize='none'
            secureTextEntry={true}
            placeholder='请再次输入密码'
            icon={EyeOffIconFill}
            validator={PasswordValidator}
            onChangeText={this.onPassword2InputValidationResult}
            returnKeyType="done"
          /> 

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingVertical: 15 }}>
            <Radio status = "success"
              text="我有车"
              checked={role == 1}
              onChange={() => this.onRadioChecked(1)}
            />
            <Radio status = "success"
              text="我是乘客"
              checked={role == 2}
              onChange={() => this.onRadioChecked(2)}
            />
          </View>
          <Text appearance="hint">
            {roleHint}
          </Text>
          {/* <CheckBox
            style={themedStyle.termsCheckBox}
            textStyle={themedStyle.termsCheckBoxText}
            checked={this.state.termsAccepted}
            onChange={this.onTermsValueChange}
            text='I read and agree to Terms & Conditions'
          /> */}
        </View>
      </View>
    );
  }
}

export const SignUpForm = withStyles(SignUpFormComponent, (theme: ThemeType) => ({
  container: {},
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  usernameInput: {},
  emailInput: {
    marginTop: 16,
  },
  passwordInput: {
    marginTop: 16,
  },
  termsCheckBox: {
    marginTop: 24,
  },
  termsCheckBoxText: {
    color: theme['text-hint-color'],
    ...textStyle.subtitle,
  },
}));
