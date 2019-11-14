import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten/theme';
import {
  Button,
  Input,
  Text,
  Modal
} from 'react-native-ui-kitten/ui';
// import { CommentsList1 } from '@src/components/articles';
import { ProductInfo } from './productInfo.component';
import {
  Product,
  Comment,
} from '@src/core/model';
import {
  // ContainerView,
  textStyle,
} from '@src/components/common';
import { ScrollPageView } from '@src/pages/scrollPageView';
import { NavigationScreenProps } from 'react-navigation';
import { NavigationScreenConfig } from 'react-navigation';
import { ProductImages } from './productImages.component';
import { PageView } from '@src/pages/pageView';
import Gallery from 'react-native-image-gallery';
import { UserAccount } from '@src/core/userAccount/userAccount';
import { HeartIconFill } from '@src/assets/icons';
import { getThemeValue } from 'react-native-ui-kitten/theme/theme/theme.service';
import { themes } from '@src/core/themes';


interface ComponentProps {
  product: Product;
  comments: Comment[];
  currentCommentText: string;
  onCommentSubmit: () => void;
  onCommentTextChange: (text: string) => void;
  onCommentMorePress: (index: number) => void;
  onCommentReplyMorePress: (index: number) => void;
  onCommentLikePress: (index: number) => void;
  onBuyPress: () => void;
}

interface State {
  // selectedColorIndex: number;
  modalVisible: boolean
}

export type ProductDetailsProps = ThemedComponentProps & ComponentProps & NavigationScreenProps;

class ProductDetailsComponent extends React.Component<ProductDetailsProps, State> {

  static navigationOptions: NavigationScreenConfig<any> = ({ navigation, screenProps }) => {
    const title = navigation.getParam('title')
    const heartIcon = () => (
      HeartIconFill({tintColor:getThemeValue("color-danger-default",themes["App Theme"]),height:20,width:20})
    );
    
    const rightControls = <TouchableOpacity>{heartIcon()}</TouchableOpacity>
    return { title ,rightControls};
  };

  public state: State = {
    modalVisible: false,
  };

  private onBuyPress = (): void => {
    // this.props.onBuyPress();
    this.props.navigation.navigate({ routeName: 'Chat',params:{msgUid:UserAccount.instance.id == "1" ? "2":"1"} })
  };

  private onImagePress = (index: number) => {
    // this.setState({modalVisible:true})
    this.props.navigation.navigate("ImagesGallary",
      {
        images: this.product.images.map(img => { return { source: img.imageSource } }),
        index
      }
    )
  }

  private onProductColorSelect = (selectedColorIndex: number): void => {
    // this.setState({ selectedColorIndex });
  };

  private onCommentLikePress = (index: number) => {
    this.props.onCommentLikePress(index);
  };

  private onCommentMorePress = (index: number) => {
    this.props.onCommentMorePress(index);
  };

  private onCommentReplyMorePress = (index: number) => {
    this.props.onCommentReplyMorePress(index);
  };

  private onCommentTextChange = (text: string): void => {
    this.props.onCommentTextChange(text);
  };

  private handleTextSubmit = () => {
    this.props.onCommentSubmit();
  };


  private onToggleModal = (): void => {
    const visible: boolean = !this.state.modalVisible;

    this.setState({ modalVisible: visible });
  };

  private onBackdropPress = (): void => {

    this.onToggleModal();

  };

  private product: Product

  public componentWillMount() {
    this.product = this.props.navigation.getParam("product")
  }

  public render(): React.ReactNode {
    const { themedStyle, comments, currentCommentText } = this.props;
    const product: Product = this.product
    return (
      <PageView style={{ flex: 1 }}>
        <ScrollPageView style={themedStyle.container} bounces={true}>
          <ProductInfo
            image={product.logo.imageSource}
            name={product.productName}
            productSlogan={product.productSlogan}
            price={`${product.price} 元`}
            description={product.productDescription}
          // size={product.size}
          // colors={product.colors}
          // selectedColorIndex={this.state.selectedColorIndex}
          // onColorSelect={this.onProductColorSelect}
          />
          <ProductImages
            style={themedStyle.screenshotList}
            contentContainerStyle={themedStyle.screenshotListContent}
            data={product.images}
            onItemPress={this.onImagePress}
          />

          {/* <View style={themedStyle.commentsContainer}>
          <Text
            style={themedStyle.inputLabel}
            category='s1'>
            Comments
          </Text>
          <Input
            style={themedStyle.input}
            textStyle={textStyle.paragraph}
            placeholder='Write your comment'
            value={currentCommentText}
            onChangeText={this.onCommentTextChange}
            onSubmitEditing={this.handleTextSubmit}
          />
          <CommentsList1
            data={comments}
            onLikePress={this.onCommentLikePress}
            onMorePress={this.onCommentMorePress}
            onReplyMorePress={this.onCommentReplyMorePress}
          />
        </View> */}
        </ScrollPageView>
        <View style={themedStyle.buttonGroup}>
          <Button
            style={themedStyle.buyButton}
            textStyle={textStyle.button}
            size='small'
            onPress={this.onBuyPress}>
            发消息
        </Button>
          <Button
            style={themedStyle.buyButton}
            textStyle={textStyle.button}
            size='small'
            onPress={this.onBuyPress}>
            电话
        </Button>
        </View>
      </PageView>

    );
  }
}

export const ProductDetailsPage = withStyles(ProductDetailsComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: theme['background-basic-color-1'],
  },
  commentsContainer: {
    paddingHorizontal: 8,
    paddingVertical: 24,
    backgroundColor: theme['background-basic-color-2'],
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
    marginHorizontal: 16,
    ...textStyle.subtitle,
  },
  buttonGroup: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: theme['background-basic-color-1'],
  },
  buyButton: {
    // marginHorizontal: 16,
    marginVertical: 10,
  },
  screenshotList: {
    backgroundColor: theme['background-basic-color-1'],
  },
  screenshotListContent: {
    marginHorizontal: 8,
    marginBottom: 24,
  },
}));
