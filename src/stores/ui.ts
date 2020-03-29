import { store } from "react-easy-state";

import { IUIStore } from "../interfaces";


export const UIStore: IUIStore = store({
    activeModal: 'submit'
});

export const UIActions = {
    hideModal() {
        UIStore.activeModal = null
    },
    showInitiate() {
        UIStore.activeModal = 'initiate';
    },
    showVerify() {
        UIStore.activeModal = 'verify';
    },
    showSubmit() {
        UIStore.activeModal = 'submit';
    }
};
