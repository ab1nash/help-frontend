export interface IMapStore {
    lat: any
    lng: any
    hasMarker: boolean
}

export interface IUIStore {
    activeModal: null | 'opening-note' | 'otp' | 'request' | 'success'
}

export interface IAuthStore {
    token: string
}
