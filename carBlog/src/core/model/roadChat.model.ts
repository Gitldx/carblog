
import { Profile } from './profile.model';
import { Location } from './park';
import { AccountRoleType } from '../userAccount/type';

export interface RoadChat {
  id?: string;
  uid?: string;
  image?: string;
  role: AccountRoleType;
  // authorProfile?: Profile;
  chat: string;
  carNumber: string;
  nickname: string;
  time?: string;
  location?: Location;
  gcjLocation?: number[];
  cityCode: number;
  road: string;
  distance?: number;
}
