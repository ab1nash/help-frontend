import React from 'react';
import { view } from "react-easy-state";
import { usePosition } from "use-position";

import { MapStore, MapActions } from "./stores/map";
import { Guard } from "./components/Guard";
import { Map } from "./components/Map";
import { InitiateRequestButton } from "./components/InitiateRequestButton";
import { InitiateRequestModal } from "./components/InitiateRequestModal";
import { VerifyOTPModal } from "./components/VerifyOTPModal";
import { CoordinatesAlert } from "./components/CoordinatesAlert";
import { SubmitRequestModal } from "./components/SubmitRequestModal";


export const App = view(() => {

    const { latitude: lat, longitude: lng, timestamp, accuracy, errorMessage } = usePosition(false);

    if (lat && lng) {
        MapActions.setMarkerPosition(lat, lng);
    }

    return (
        <Guard>
            <Map />
            <CoordinatesAlert />
            <InitiateRequestButton />
            <InitiateRequestModal />
            <VerifyOTPModal />
            <SubmitRequestModal />
        </Guard>
    );
});
