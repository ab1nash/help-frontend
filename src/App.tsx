import React, { useEffect } from 'react';
import { view } from "react-easy-state";
import { usePosition } from "use-position";
import { Container } from 'react-bootstrap';
import { Switch, Route, Redirect } from "react-router-dom";
import Div100vh from 'react-div-100vh';

import { MapStore, MapActions } from "./stores/map";
import { AuthActions } from "./stores/auth";
import { Map } from "./components/Map";
import { RegistrationForm } from "./components/RegistrationForm";
import { RequestList } from "./components/RequestList";
import {RequestForm} from "./components/RequestForm";
import {ProtectedRoute} from "./components/ProtectedRoute";


export const App = view(() => {

    const { latitude: lat, longitude: lng } = usePosition(false);

    AuthActions.setToken(localStorage.getItem("token"));

    // set marker from location
    useEffect(() => {
        if (lat && lng) {
            MapActions.setMarkerPosition(lat, lng);
        }
    }, [lat, lng]);

    return (
        <>
            <Map />
            <Div100vh style={{height: "50rvh", maxHeight: "50rvh"}}>
                <Switch>
                    <ProtectedRoute exact path="/">
                        <RequestList />
                    </ProtectedRoute>
                    <Route path="/register">
                        <RegistrationForm />
                    </Route>
                    <ProtectedRoute path="/create">
                        <RequestForm />
                    </ProtectedRoute>
                    <Redirect to="/" />
                </Switch>
            </Div100vh>
        </>
    );
});
