export interface IMapStore {
    lat: any
    lng: any
    hasMarker: boolean
}

export interface IUIStore {
    isInitiateVisible: boolean
    isVerifyVisible: boolean
    isSubmitVisible: boolean
}

export interface IAuthStore {
    userToken: string
}
