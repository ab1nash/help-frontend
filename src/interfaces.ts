export interface IMapStore {
    lat: any
    lng: any
}

export interface IUIStore {
    isSettingsModalOpen: boolean
}

export interface IAuthStore {
    token: string | null
    isAdmin: boolean
}
