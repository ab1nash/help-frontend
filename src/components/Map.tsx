import { view } from 'react-easy-state';
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, useGoogleMap, StandaloneSearchBox } from '@react-google-maps/api'
import Form from 'react-bootstrap/Form';

import { MapStore, MapActions } from "../stores/map";


const libraries = ["drawing", "places"];

export const Map = view(() => {
    const [searchBox, setSearchBox] = useState(undefined);

    const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    // const map: GoogleMap = useGoogleMap();

    const lat = MapStore.lat, lng = MapStore.lng;

    const onCenterChanged = () => {
        // MapActions.setMarkerPosition()
    };

    const onDragEnd = (e: any) => {
        MapActions.setMarkerPosition(e.latLng.lat(), e.latLng.lng());
    };

    const onLoad = (ref: any) => setSearchBox(ref);

    const onPlacesChanged = () => {
        // @ts-ignore
        let loc = searchBox.getPlaces()[0].geometry.location;
        let lat = loc.lat(), lng = loc.lng();
        MapActions.setMarkerPosition(lat, lng);
    };

    return (
        <LoadScript googleMapsApiKey={googleMapsAPIKey} libraries={libraries}>
            <GoogleMap mapContainerStyle={{maxWidth: "100%", minHeight: "100vh",}} zoom={15} center={{ lat, lng }} onCenterChanged={onCenterChanged}>
                <StandaloneSearchBox
                    onLoad={onLoad}
                    onPlacesChanged={onPlacesChanged}
                >
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    style={{
                      width: `360px`,
                      height: `50px`,
                      padding: `0 12px`,
                      textOverflow: `ellipses`,
                      position: "absolute",
                      left: "50%",
                      top: "10px",
                      marginLeft: "-180px"
                    }}
                  />
                </StandaloneSearchBox>
                <Marker position={{lat, lng}} draggable={true} onDragEnd={onDragEnd} />
            </GoogleMap>
        </LoadScript>
    )
});

