export interface SummaryMarker {
    id: string
    coordinates: {lat: any, lng: any}
    color: string
}

export interface IMapStore {
    lat: any
    lng: any
    summaryMarkers: SummaryMarker[]
}

export interface IUIStore {
    activeModal: 'admin' | null
}

export interface IAuthStore {
    token: string | null
    isAdmin: boolean
}
