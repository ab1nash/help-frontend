import { store } from "react-easy-state";

import {IAuthStore} from "../interfaces";


export const AuthStore: IAuthStore = store({
    token: ''
});

export const AuthActions = {
    setToken(token: string) {
        AuthStore.token = token;
        localStorage.setItem("token", token);
    }
};
