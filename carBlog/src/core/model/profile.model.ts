import { ImageSource } from '@src/assets/images';

export enum Gender {
  MALE = 0,
  FEMALE = 1,
}

export interface Profile {
  avatar?: ImageSource;
  // about?: string;
  // accountName? : string;
  // accountPwd?:string;
  nickname? : string;
  // gender?: Gender;
  carNumber?:string;
  phoneNumber?: string;
  location?: string;
}

// export interface ProfileSocials {
//   followers: number;
//   following: number;
//   posts: number;
// }

// export interface CategorisedProfileActivity {
//   [category: string]: ProfileActivity[];
// }

// export interface ProfileActivity {
//   category: string;
//   source: ImageSource;
// }
