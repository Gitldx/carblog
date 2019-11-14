import { SharePark, OffStreetPark } from "@src/core/model/park";
import { UserAccount } from "@src/core/userAccount/userAccount";



export type ParkItem = SharePark & OffStreetPark 
    &{distance:number,publisher:UserAccount,duration:number}