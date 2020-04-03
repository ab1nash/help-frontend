import { store } from "react-easy-state";

import { IUIStore } from "../interfaces";


export const UIStore: IUIStore = store({
    activeModal: null
});

export const UIActions = {
    setActiveModal(modal: any) {
        UIStore.activeModal = modal;
    }
};
