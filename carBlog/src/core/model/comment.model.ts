import { Profile } from './profile.model';

export interface Comment {
  index:number;
  author: string;
  authorProfile : Profile;
  text: string;
  // likesCount: number;
  likes : string[];
  date: Date;
  dateString : string;
  // comments?: Comment[];
}
