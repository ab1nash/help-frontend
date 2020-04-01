import { store } from "react-easy-state";

import { IMapStore } from "../interfaces";


export const MapStore: IMapStore = store({
    lat: null,
    lng: null,
});

export const MapActions = {
    setMarkerPosition(lat: number, lng: number) {
        MapStore.lat = lat;
        MapStore.lng = lng;
    }
};
