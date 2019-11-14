import React from 'react';
import { View } from 'react-native';
import {
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  Avatar,
  AvatarProps,
  ButtonProps,
} from 'react-native-ui-kitten/ui';

interface ComponentProps {
  button?: () => React.ReactElement<ButtonProps>;
}

export type ProfilePhotoProps = ComponentProps & AvatarProps;

class ProfilePhotoComponent extends React.Component<ProfilePhotoProps> {

  private renderEditElement = (): React.ReactElement<ButtonProps> => {
    const buttonElement: React.ReactElement<ButtonProps> = this.props.button();

    return React.cloneElement(buttonElement, {
      style: [buttonElement.props.style, this.props.themedStyle.editButton],
    });
  };

  public render(): React.ReactNode {
    const { style, themedStyle, button, ...restProps } = this.props;

    return (
      <View style={style}>
        <Avatar
          style={[style, themedStyle.avatar]}
          {...restProps}
        />
        {button ? this.renderEditElement() : null}
      </View>
    );
  }
}

export const ProfilePhoto = withStyles(ProfilePhotoComponent, (theme: ThemeType) => ({
  avatar: {
    alignSelf: 'center',
    tintColor: 'lightgrey'
  },
  editButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
  },
}));

