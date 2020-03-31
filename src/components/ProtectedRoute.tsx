import React, { useEffect } from 'react';
import { withRouter, Route, Redirect } from 'react-router-dom';
import { view } from 'react-easy-state';

import * as api from "../api";
import { AuthStore, AuthActions } from "../stores/auth";


export const ProtectedRoute = withRouter(view((props: any) => {

    const { exact, path, ...rest } = props;
    const token = AuthStore.token;

    useEffect(() => {
        (async () => {
            try {
                await api.checkToken();
            } catch (e) {
                AuthActions.setToken("");
                return;
            }
        })();
    }, [token]);

    return token ? (
        <Route exact={exact} path={path}>
            {props.children}
        </Route>
    ) : (
        <Redirect to="/register" />
    )
}));
