import React, { useEffect } from 'react';
import { view, store } from "react-easy-state";
import { usePosition } from "use-position";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import Div100vh from 'react-div-100vh';

import * as api from "./api";
import { MapStore, MapActions } from "./stores/map";
import {AuthActions, AuthStore} from "./stores/auth";
import { Map } from "./components/Map";
import { RegistrationForm } from "./components/RegistrationForm";
import { RequestList } from "./components/RequestList";
import {RequestForm} from "./components/RequestForm";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {RequestListSelector} from "./components/RequestListSelector";
import {Summary} from "./components/Summary";
import {AdminModal} from "./components/AdminModal";
import { UIActions } from "./stores/ui";


export const App = view(() => {

    const { latitude: lat, longitude: lng } = usePosition(false);
    const location = useLocation();
    if (location.pathname === "/admin") {
        UIActions.setActiveModal('admin');
    }

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
        <>
            <Map />
            <Div100vh key={UIActions.getHeight()} style={{height: `${100-UIActions.getHeight()}rvh`, maxHeight: "100rvh"}}>
                <Switch>
                    <ProtectedRoute exact path="/">
                        <Summary />
                        {AuthStore.isAdmin && <RequestListSelector /> }
                        <RequestList all={false} />
                    </ProtectedRoute>
                    <ProtectedRoute isAdmin={true} path="/all">
                        <Summary />
                        <RequestListSelector />
                        <RequestList all={true} />
                    </ProtectedRoute>
                    <ProtectedRoute isAdmin={true} path="/admin">
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
            <AdminModal />
        </>
    );
});
