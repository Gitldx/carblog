import { ImageSource } from '@src/assets/images';
import { Comment } from './comment.model';
import { Profile } from './profile.model';
import { Location } from './park';

export interface Article {
  id: string;
  uid ?: string;
  authorProfile? : Profile;
  title: string;
  // description: string;
  content: string;
  // images?: ImageSource[];
  image: string;
  imgRatio:number;
  //author?: Profile;
  date: string;
  // tips: number;
  comments: Comment[];
  likes?: string[];
  visitCounts?: number;
  location?: Location;
  gcjLocation? : number[];
  distance? : number;
}
