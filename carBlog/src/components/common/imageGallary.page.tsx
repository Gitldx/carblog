import React from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import Gallery from 'react-native-image-gallery';
import { ImageSource } from '@src/assets/images';
import { NavigationScreenProps, NavigationScreenConfig } from 'react-navigation';
import { View } from 'react-native';
import { CloseIconOutline } from '@src/assets/icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KEY_NAVIGATION_BACK } from '@src/core/navigation/constants';

interface GalleryProps {
  // images:{source:ImageSource}[]
}

export type Props = ThemedComponentProps & GalleryProps & NavigationScreenProps

class ImageGallaryComponent extends React.Component<Props> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const leftControl = <View style={{ flex: 1, alignItems: 'flex-start'}}>
      <TouchableOpacity style={{marginLeft:15}} onPress={() => navigation.goBack(KEY_NAVIGATION_BACK)}>
        {CloseIconOutline({ tintColor: 'white', width: 30, height: 30 })}
      </TouchableOpacity>
    </View>

    return { leftControl, topBarStyle: { backgroundColor: "black" } };
  };

  images: { source: ImageSource }[]
  index : number
  public componentWillMount() {
    this.images = this.props.navigation.getParam("images")
    this.index = this.props.navigation.getParam("index")
  }

  public render(): React.ReactNode {
    const { themedStyle, ...restProps } = this.props;
    const images = this.images
    return (
      <Gallery
        style={{ flex: 1, backgroundColor: 'black' }}
        images={images}
        initialPage = {this.index}
        onSingleTapConfirmed = {()=>this.props.navigation.goBack(KEY_NAVIGATION_BACK)}
      />

    );
  }
}

export const ImageGallaryPage = withStyles(ImageGallaryComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));
