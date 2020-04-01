import React, { useEffect } from 'react';
import { view } from "react-easy-state";
import { usePosition } from "use-position";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Div100vh from 'react-div-100vh';
import { BrowserRouter as Router } from "react-router-dom";

import { MapStore, MapActions } from "./stores/map";
import {AuthActions, AuthStore} from "./stores/auth";
import { Map } from "./components/Map";
import { RegistrationForm } from "./components/RegistrationForm";
import { RequestList } from "./components/RequestList";
import {RequestForm} from "./components/RequestForm";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {RequestListSelector} from "./components/RequestListSelector";
import * as api from "./api";
import {Summary} from "./components/Summary";
import {SettingsModal} from "./components/SettingsModal";


export const App = view(() => {

    const { latitude: lat, longitude: lng } = usePosition(false);

    AuthActions.setToken(localStorage.getItem("token"));

    useEffect(() => {
        (async () => {
            try {
                await api.checkUser();
            } catch (e) {
                return AuthActions.setToken("");
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await api.checkAdmin();
            } catch (e) {
                return AuthActions.setAdmin(false);
            }
            AuthActions.setAdmin(true);
        })()
    }, []);

    useEffect(() => {
        if (lat && lng) {
            MapActions.setMarkerPosition(lat!, lng!);
        }
    }, [lat, lng]);

    return (
        <Router>
            <Map />
            <Div100vh style={{height: "50rvh", maxHeight: "50rvh"}}>
                <Switch>
                    <ProtectedRoute exact path="/">
                        <Summary />
                        {AuthStore.isAdmin && <RequestListSelector /> }
                        <RequestList all={false} />
                    </ProtectedRoute>
                    <ProtectedRoute exact isAdmin={true} path="/all">
                        <Summary />
                        <RequestListSelector />
                        <RequestList all={true} />
                    </ProtectedRoute>
                    <Route path="/register">
                        <RegistrationForm />
                    </Route>
                    <ProtectedRoute path="/view/:id">
                        <RequestForm fill={true} />
                    </ProtectedRoute>
                    <ProtectedRoute path="/create">
                        <RequestForm fill={false} />
                    </ProtectedRoute>
                    <Redirect to="/" />
                </Switch>
            </Div100vh>
            <SettingsModal />
        </Router>
    );
});
