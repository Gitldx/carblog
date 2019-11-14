
export interface Location {
    type?: string;
    coordinates: number[]
}

export interface Park {
    id?: string;
    uid: string;
    carNumber: string;
    carPhone: string;
    leaveTime?: Date;
    location?: Location;
    gcjLocation? : number[];
}


export interface SharePark {
    id: string;
    uid: string;
    offStreetParkId: string;
    location: Location;
    gcjLocation : number[];
    parkNumber: string;
    streetName: string;
    forFree: boolean;
    note: string;
    publishTime: Date;
    
}

export interface OffStreetPark {
    id: string;
    parkName: string;
    location: Location;
    gcjLocation : number[];
    streetName: string;
    forFree: boolean;
    // note: string;

}