import React from 'react';
import {
  ImageSourcePropType,
  View,
  ViewProps,
} from 'react-native';
import { Text } from 'react-native-ui-kitten/ui';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import { Avatar } from 'react-native-ui-kitten/ui';
import { textStyle } from '@src/components/common/style';
import { MaterialCommunityIcons } from '@src/assets/icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Profile } from '@src/core/model';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { NavigationScreenProp } from 'react-navigation';

interface ComponentProps {
  profile : Profile,
  navigation : NavigationScreenProp<any,any>,
  photo: ImageSourcePropType;
  name: string;
  date: string;
}

export type ActivitiAuthoringProps = ThemedComponentProps & ViewProps & ComponentProps;

class ActivityAuthoringComponent extends React.Component<ActivitiAuthoringProps> {

  private gotoblogs = ()=>{
    const p = this.props.profile
    const ua : UserAccount = {id:p.id,nickname:p.nickname,image:p.image,carNumber:p.carNumber} as any
    this.props.navigation.push("UserBlog",{ua})
  }


  public render(): React.ReactNode {
    const { style, themedStyle,photo, name, date, ...restProps } = this.props;

    return (
      <View
        {...restProps}
        style={[themedStyle.container, style]}>
        <TouchableOpacity onPress={this.gotoblogs}>
          {photo ? <Avatar
            style={themedStyle.authorPhoto}
            source={photo} /> : <MaterialCommunityIcons name="account" />
          }
        </TouchableOpacity>


        <View style={themedStyle.authorInfoContainer}>
          <Text style={themedStyle.authorNameLabel}>{name}</Text>
          <Text
            style={themedStyle.dateLabel}
            appearance='hint'
            category='p2'>
            {date}
          </Text>
        </View>
      </View>
    );
  }
}

export const ActivityAuthoring = withStyles(ActivityAuthoringComponent, (theme: ThemeType) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorInfoContainer: {
    marginLeft: 16,
  },
  authorPhoto: {
    margin: 0,
  },
  authorNameLabel: textStyle.subtitle,
  dateLabel: textStyle.paragraph,
}));
