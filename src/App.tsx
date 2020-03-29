import React from 'react';
import { view } from "react-easy-state";
import { usePosition } from "use-position";

import { MapStore, MapActions } from "./stores/map";
import { Guard } from "./components/Guard";
import { Map } from "./components/Map";
import { OpeningNoteModal } from "./components/OpeningNoteModal";
import { InitiateButton } from "./components/InitiateButton";
import { InitiateModal } from "./components/InitiateModal";
import { VerifyModal } from "./components/VerifyModal";
import { CoordinatesAlert } from "./components/CoordinatesAlert";
import { SubmitModal } from "./components/SubmitModal";


export const App = view(() => {

    const { latitude: lat, longitude: lng } = usePosition(false);

    MapActions.setMarkerPosition(lat!, lng!);

    return (
        <Guard>
            <Map />
            <CoordinatesAlert />
            <InitiateButton />
            <OpeningNoteModal />
            <InitiateModal />
            <VerifyModal />
            <SubmitModal />
        </Guard>
    );
});
