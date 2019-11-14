import React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  View,
  ImageSourcePropType,
} from 'react-native';
import { contentBoxProps } from './contentBox.component';
import { Avatar, Text, withStyles, ThemeType, AvatarProps } from 'react-native-ui-kitten';

import Icon from 'react-native-vector-icons/SimpleLineIcons'


interface avatarContentBoxProps {
  imagePosition: "left" | "right"
  imageSource?: ImageSourcePropType,
  imageSize?: number,
  imageShape?: 'round' | 'rounded' | 'square'
  children?: React.ReactNode;
}

type avatarContentBoxType = contentBoxProps & avatarContentBoxProps

class AvatarContentBoxComponent extends React.Component<avatarContentBoxType> {

  public render(): React.ReactElement<ScrollViewProps> {

    const { themedStyle, customTitleBox, icon, titleLabel, titleInfo, subTitle, textParagraph, paragraphApparent, paragraphCategory, style,
      imagePosition = "left", imageSource, imageSize = 50, imageShape = "rounded", ...restProps } = this.props;


    return (
      <View style={[{
        flexDirection: 'row'
      }, style]}>

        {imagePosition == "left" ? <View style={{ alignSelf: 'center', paddingHorizontal: 5 }}>
          {imageSource ?
            <Avatar shape={imageShape} source={imageSource} style={{ width: imageSize, height: imageSize }} />
            :
            <Icon name="picture" size={30} color="lightgrey" />
          }
        </View> : null}

        <View style={[themedStyle.right]} {...restProps}>
          {
            !customTitleBox ?
              <View style={themedStyle.titleSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {icon ? icon() : null}
                  {titleLabel ? <Text category="s2" style={{ marginLeft: icon ? 5 : 0 }}>{titleLabel}</Text> : null}
                </View>
                {titleInfo ? <Text appearance="hint" category="p2">{titleInfo}</Text> : null}
              </View>
              : customTitleBox()
          }
          {
            subTitle ?
              <View style={themedStyle.subTileSection}>
                {subTitle()}
              </View>
              : null
          }
          {
            textParagraph ?
              <View style={themedStyle.descriptionSection}>
                <Text appearance={paragraphApparent ? paragraphApparent : "hint"} category={paragraphCategory ? paragraphCategory : "p2"} >{textParagraph}</Text>
              </View>
              : null
          }
          {this.props.children ? (
            <View style={themedStyle.contentSection}>{this.props.children}</View>
          ) : null}
        </View>

        {imagePosition == "right" ? <View style={{ alignSelf: 'center', paddingHorizontal: 5 }}>
          {imageSource ?
            <Avatar shape={imageShape} source={imageSource} style={{ width: imageSize, height: imageSize }} />
            :
            <Icon name="picture" size={30} color="lightgrey" />
          }
        </View> : null}


      </View>
    );
  }
}



export const AvatarContentBox = withStyles(AvatarContentBoxComponent, (theme: ThemeType) => ({
  right: {
    flex: 1
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingBottom: 0
  },
  descriptionSection: {

    paddingLeft: 16,
    paddingBottom: 0,
  },
  contentSection: {
    // justifyContent: 'center',
    paddingLeft: 16,
    paddingBottom: 0,
  }
}));
