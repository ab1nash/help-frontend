import { store } from "react-easy-state";

import {IMapStore, SummaryMarker} from "../interfaces";


export const MapStore: IMapStore = store({
    lat: null,
    lng: null,
    summaryMarkers: [],
});

export const MapActions = {
    setMarkerPosition(lat: number, lng: number) {
        MapStore.lat = lat;
        MapStore.lng = lng;
    },
    setSummary(summaryMarkers: SummaryMarker[]) {
        MapStore.summaryMarkers = summaryMarkers;
    }
};
