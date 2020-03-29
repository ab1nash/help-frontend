export interface IMapStore {
    lat: any
    lng: any
    hasMarker: boolean
}

export interface IUIStore {
    activeModal: null | 'initiate' | 'verify' | 'submit'
}

export interface IAuthStore {
    userToken: string
    adminToken: string
}
