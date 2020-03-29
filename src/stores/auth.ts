import { store } from "react-easy-state";

import {IAuthStore} from "../interfaces";


export const AuthStore: IAuthStore = store({
    adminToken: '',
    userToken: ''
});

export const AuthActions = {
    setUserToken(userToken: string) {
        AuthStore.userToken = userToken;
    },
    setAdminToken(adminToken: string) {
        AuthStore.adminToken = adminToken;
    }
};
