import { Profile } from "./profile.model";
import { ImageSource } from "@src/assets/images";

export interface Shop {
    id: string;
    uid : string;
    owner: Profile;
    logo: ImageSource;
    slogan: string;
    visitCounts : number;
    likes:string[];
    openService : boolean,
    serviceEndDate : Date
    // distance : string    
}

export interface Product {
    id: string;
    // shop: Shop;
    uid : string
    owner : Profile
    productName: string;
    logo: ImageSource;
    open : boolean;
    productSlogan: string;
    productDescription: string;
    price: number;
    visitCounts : number;
    images : ImageSource[]
    like:string[];
    openService : boolean,
    serviceEndDate : Date
    // sales : number;
    // positiveComments : number;
    // negativeComments : number
}