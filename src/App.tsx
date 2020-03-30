import React, { useEffect } from 'react';
import { view } from "react-easy-state";
import { usePosition } from "use-position";

import * as api from "./api";
import { MapStore, MapActions } from "./stores/map";
import { AuthActions } from "./stores/auth";
import { Guard } from "./components/Guard";
import { Map } from "./components/Map";
import { OpeningNoteModal } from "./components/OpeningNoteModal";
import { InitiateButton } from "./components/InitiateButton";
import { OTPModal } from "./components/OTPModal";
import { RequestModal } from "./components/RequestModal";
import { InstructionsAlert } from "./components/InstructionsAlert";
import { SuccessModal } from "./components/SuccessModal";


export const App = view(() => {

    const { latitude: lat, longitude: lng } = usePosition(false);

    MapActions.setMarkerPosition(lat!, lng!);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            AuthActions.setToken(token);
            try {
                await api.checkToken();
            } catch (e) {
                AuthActions.setToken("");
                return;
            }
        })();
    }, []);

    return (
        <>
            <InstructionsAlert />
            <Map />
            <InitiateButton />
            <OpeningNoteModal />
            <OTPModal />
            <RequestModal />
            <SuccessModal />
        </>
    );
});
