import { store } from "react-easy-state";

import { IUIStore } from "../interfaces";


export const UIStore: IUIStore = store({
    activeModal: "opening-note"
});

export const UIActions = {
    hideModal() {
        UIStore.activeModal = null
    },
    showOTP() {
        UIStore.activeModal = 'otp';
    },
    showRequest() {
        UIStore.activeModal = 'request';
    },
    showSuccess() {
        UIStore.activeModal = 'success';
    }
};
