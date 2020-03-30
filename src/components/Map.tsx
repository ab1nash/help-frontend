import React, { useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { view } from 'react-easy-state';
import Form from 'react-bootstrap/Form';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api'

import { MapStore, MapActions } from "../stores/map";


const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["drawing", "places"];

export const Map = view(() => {
    const { lat, lng } = MapStore;
    const searchBox = useRef(undefined);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })


    const onDragEnd = (e: any) => {
        MapActions.setMarkerPosition(e.latLng.lat(), e.latLng.lng());
    };

    const onLoad = (ref: any) => {
        searchBox.current = ref;
    };

    const onPlacesChanged = () => {
        // @ts-ignore
        let loc = searchBox.current.getPlaces()[0].geometry.location;
        let lat = loc.lat(), lng = loc.lng();
        MapActions.setMarkerPosition(lat, lng);
    };

    return (
        <LoadScript googleMapsApiKey={googleMapsAPIKey} libraries={libraries}>
            <GoogleMap zoom={17} center={{lat, lng}}
                       mapContainerStyle={{height: "100vh"}}
                       options={{mapTypeControl: false, streetViewControl: false, fullscreenControl: false}}>
                <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                    <Form.Control type="text" placeholder="Search" className="position-absolute"
                                  style={{width: "360px", height: "50px", top: isTabletOrMobile ? "100px" : "10px", left: "calc(50% - 180px)"}} />
                </StandaloneSearchBox>
                <Marker position={{lat, lng}} draggable={true} onDragEnd={onDragEnd} />
            </GoogleMap>
        </LoadScript>
    )
});
