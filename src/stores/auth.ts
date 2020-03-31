import { store } from "react-easy-state";

import {IAuthStore} from "../interfaces";


export const AuthStore: IAuthStore = store({
    token: null,
    isAdmin: true
});

export const AuthActions = {
    setToken(token: string | null) {
        AuthStore.token = token;
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    },
    setAdmin(isAdmin: boolean) {
        AuthStore.isAdmin = isAdmin
    }
};
