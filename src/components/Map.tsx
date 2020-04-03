import React, {useEffect, useRef} from 'react';
import { view } from 'react-easy-state';
import { useLocation, useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api'
import Div100vh from 'react-div-100vh';
import colorConvert from "color-convert";

import { MapStore, MapActions } from "../stores/map";
import {SummaryMarker} from "../interfaces"
import { Alert } from 'react-bootstrap';


export const Map = view((props: any) => {
    const { lat, lng } = MapStore;
    const searchRef = useRef(undefined);
    const mapRef = useRef(undefined);
    const location = useLocation();
    const history = useHistory();
    const isCreate = location.pathname === "/create";
    const isView = location.pathname.startsWith("/view");
    const showSingleMarker = isCreate || isView;
    const showSummaryMarkers = !showSingleMarker;


    const onMarkerDragEnd = (e: any) => MapActions.setMarkerPosition(e.latLng.lat(), e.latLng.lng());

    const onSearchLoad = (ref: any) => searchRef.current = ref;

    const onMapLoad = (ref: any) => mapRef.current = ref;

    useEffect(() => {
        if (showSingleMarker && mapRef.current) {
            // @ts-ignore
            mapRef.current!.setZoom(17);
        }
    }, [showSingleMarker]);

    const onPlacesChanged = () => {
        // @ts-ignore
        let loc = searchRef.current.getPlaces()[0].geometry.location;
        let lat = loc.lat(), lng = loc.lng();
        MapActions.setMarkerPosition(lat, lng);
    };

    const getMarkerIcon = (marker: any) => {
        return `http://www.googlemapsmarkers.com/v1/${marker.id}/${colorConvert.keyword.hex(marker.color)}/`
    };


    return (
        <Div100vh style={{height: "50rvh"}} className="position-relative">
            <GoogleMap zoom={11} center={{lat, lng}} onLoad={onMapLoad}
                       mapContainerStyle={{height: "100%", margin: "auto"}}
                       options={{mapTypeControl: false, streetViewControl: false, fullscreenControl: false}}>
                <StandaloneSearchBox onLoad={onSearchLoad} onPlacesChanged={onPlacesChanged}>
                    <Form.Control type="text" placeholder="Search" className="position-absolute"
                                  style={{width: "360px", height: "50px", top: "10px", left: "calc(50% - 180px)"}} />
                </StandaloneSearchBox>
                {showSummaryMarkers && MapStore.summaryMarkers.map((marker: SummaryMarker) =>
                    <Marker key={marker.id} position={marker.coordinates} label={`#${marker.id}`}
                            onClick={() => history.push(`/view/${marker.id}`)} />)}
                {showSingleMarker &&
                <>
                    {!isCreate &&
                    <Alert variant="primary" className="text-center position-absolute"
                           style={{bottom: 0, left: "50%", transform: "translateX(-50%)", fontSize: "0.8rem"}}>
                      Tap pin to open in Google Maps
                    </Alert>}
                  <Marker position={{lat, lng}} draggable={isCreate}
                          onClick={() => window.open(`http://www.google.com/maps/place/${lat},${lng}`, "_blank")}
                          onDragEnd={onMarkerDragEnd} />
                </>}
            </GoogleMap>
        </Div100vh>
    )
});
