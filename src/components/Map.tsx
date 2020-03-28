import React from 'react';
import { view } from 'react-easy-state';
import { GoogleMap, LoadScript, Marker, useGoogleMap } from '@react-google-maps/api'

import { MapStore, MapActions } from "../stores/map";


const libraries = ["drawing"];

export const Map = view(() => {

    const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    // const map: GoogleMap = useGoogleMap();

    const lat = MapStore.lat, lng = MapStore.lng;

    const onCenterChanged = () => {
        // MapActions.setMarkerPosition()
    };

    const onDragEnd = (e: any) => {
        MapActions.setMarkerPosition(e.latLng.lat(), e.latLng.lng());
    };

    return (
        <LoadScript googleMapsApiKey={googleMapsAPIKey} libraries={libraries}>
            <GoogleMap mapContainerStyle={{maxWidth: "100%", minHeight: "100vh",}} zoom={15} center={{ lat, lng }}
                       onCenterChanged={onCenterChanged}>
                <Marker position={{lat, lng}} draggable={true} onDragEnd={onDragEnd} />
            </GoogleMap>
        </LoadScript>
    )
});
