import { ImageSourcePropType } from 'react-native';
import { qiniuImgUrl, qiniuBigThumbImgUrl,qiniuSmallThumbImgUrl } from '@src/core/uitls/httpService';

export interface ImageSource {
  imageSource: ImageSourcePropType;
}

export class RemoteImage implements ImageSource {
  readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  get imageSource(): ImageSourcePropType {
    return { uri: this.source };
  }
}


export class LocalImage extends RemoteImage{}


export function imageUri(path:string){
  return {uri:qiniuImgUrl(path)}
}

export function BigThumbnailUri(path:string){
  return {uri:qiniuBigThumbImgUrl(path)}
}


export function smallThumbnailUrl(path:string){
  return {uri:qiniuSmallThumbImgUrl(path)}
}
