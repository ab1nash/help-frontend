import React, {useRef, useState} from 'react';
import { view } from 'react-easy-state';
import { useLocation, useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api'
import Div100vh from 'react-div-100vh';
import colorConvert from "color-convert";

import { MapStore, MapActions } from "../stores/map";
import {SummaryMarker} from "../interfaces"


export const Map = view((props: any) => {
    const { lat, lng } = MapStore;
    const searchBox = useRef(undefined);
    const location = useLocation();
    const history = useHistory();


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

    const getMarkerIcon = (marker: any) => {
        return `http://www.googlemapsmarkers.com/v1/${marker.id}/${colorConvert.keyword.hex(marker.color)}/`
    };

    const isCreate = location.pathname === "/create";
    const isView = location.pathname.startsWith("/view");
    const showSingleMarker = isCreate || isView;
    const showSummaryMarkers = !showSingleMarker;

    return (
        <Div100vh style={{height: "50rvh"}}>
            <GoogleMap zoom={17} center={{lat, lng}}
                       mapContainerStyle={{height: "100%", margin: "auto"}}
                       options={{mapTypeControl: false, streetViewControl: false, fullscreenControl: false}}>
                <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                    <Form.Control type="text" placeholder="Search" className="position-absolute"
                                  style={{width: "360px", height: "50px", top: "10px", left: "calc(50% - 180px)"}} />
                </StandaloneSearchBox>
                {showSummaryMarkers && MapStore.summaryMarkers.map((marker: SummaryMarker) =>
                    <Marker key={marker.id} position={marker.coordinates} label={marker.id}
                            onClick={() => history.push(`/view/${marker.id}`)} />)}
                {showSingleMarker && <Marker position={{lat, lng}} draggable={isCreate} onDragEnd={onDragEnd} />}
            </GoogleMap>
        </Div100vh>
    )
});
