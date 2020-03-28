import { store } from "react-easy-state";

import {IAuthStore} from "../interfaces";


export const AuthStore: IAuthStore = store({
    userToken: ''
});

export const AuthActions = {
    setUserToken(userToken: string) {
        AuthStore.userToken = userToken;
    }
};
