import React from 'react';
import { withRouter, Route, Redirect } from 'react-router-dom';
import { view } from 'react-easy-state';

import { AuthStore } from "../stores/auth";


export const ProtectedRoute = withRouter(view((props: any) => {

    const { exact, path, ...rest } = props;

    return AuthStore.token ? (
        <Route exact={exact} path={path}>
            {props.children}
        </Route>
    ) : (
        <Redirect to="/register" />
    )
}));
