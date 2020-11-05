export interface IEvent {
    subject: string,
    body: string,
    bodyPreview: string,
    end: Date,
    locations: IPhysicalAddress[],
    sensitivity: Sensitivity,
    start: Date


}


export interface ILocation {
    address: IPhysicalAddress,
    coordinates: IOutlookGeoCoordinates,
    displayName: string,
    locationEmailAddress: string,
    locationUri: string,
    locationType: string,

}

export interface IPhysicalAddress {
    city: String,
    countryOrRegion: String,
    postalCode: String,
    state: String,
    street: String
}

export interface IOutlookGeoCoordinates {
    accuracy: number,
    altitude: number,
    altitudeAccuracy: number,
    latitude: number,
    longitude: number
}

export enum Sensitivity{
    normal, personal, private, confidential
}