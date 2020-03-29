export interface IMapStore {
    lat: any
    lng: any
    hasMarker: boolean
}

export interface IUIStore {
    activeModal: null | 'opening-note' | 'initiate' | 'verify' | 'submit'
}

export interface IAuthStore {
    userToken: string
    adminToken: string
}
