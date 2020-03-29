import { store } from "react-easy-state";

import { IUIStore } from "../interfaces";


export const UIStore: IUIStore = store({
    activeModal: "opening-note"
});

export const UIActions = {
    hideModal() {
        UIStore.activeModal = null
    },
    showOpeningNote() {
        UIStore.activeModal = 'opening-note';
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
