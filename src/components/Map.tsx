import React, {useRef, useState} from 'react';
import { view } from 'react-easy-state';
import { useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api'
import Div100vh from 'react-div-100vh';

import { MapStore, MapActions } from "../stores/map";


const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["drawing", "places"];

export const Map = view((props: any) => {
    const { lat, lng } = MapStore;
    const searchBox = useRef(undefined);
    const location = useLocation();


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
            <Div100vh style={{height: "50rvh"}}>
                <GoogleMap zoom={17} center={{lat, lng}}
                           mapContainerStyle={{height: "100%"}}
                           options={{mapTypeControl: false, streetViewControl: false, fullscreenControl: false}}>
                    <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                        <Form.Control type="text" placeholder="Search" className="position-absolute"
                                      style={{width: "360px", height: "50px", top: "10px", left: "calc(50% - 180px)"}} />
                    </StandaloneSearchBox>
                    {location.pathname === "/create" &&
                    <Marker position={{lat, lng}} draggable={true} onDragEnd={onDragEnd} />}
                </GoogleMap>
            </Div100vh>
        </LoadScript>
    )
});
