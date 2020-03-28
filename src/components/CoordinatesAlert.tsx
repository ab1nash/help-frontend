import React from 'react';
import { view } from 'react-easy-state';
import { Alert } from "react-bootstrap";

import { MapStore } from "../stores/map";


export const CoordinatesAlert = view(() => {

    const lat = MapStore.lat;
    const lng = MapStore.lng;
    const height = "50px";

    return (
        <Alert variant="success" className="position-absolute" style={{top: "70px", right: "10px", minHeight: height, maxHeight: height}}>
            {lat}, {lng}
        </Alert>
    )
});
