import React from 'react';
import {
  Image,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ViewProps,
  TextProps
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';


export interface IconSource {
  imageSource: ImageSourcePropType;
}

export class RemoteIcon implements IconSource {
  readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  get imageSource(): ImageSourcePropType {
    return { uri: this.source };
  }
}



export const Icon = (source: IconSource, style: StyleProp<ImageStyle>): React.ReactElement<ImageProps> => {
  return (
    <Image
      style={style}
      source={source.imageSource}
    />
  );
};


export type IconElement = React.ReactElement<ImageProps>;

type VectorIconElement = React.ReactElement<TextProps>

interface VectorIconProps{
  name : string,
  size? : number,
  color? : string
}

type vectorIconType = VectorIconProps & TextProps

export const MaterialCommunityIcons = (props: vectorIconType):VectorIconElement=>{
  const {name,size = 25,color,...restProps} = props
  return (
    <MIcon name={name} size={size} color={color}  {...restProps}/>
  )
}