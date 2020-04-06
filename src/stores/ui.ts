import { store } from "react-easy-state";

import { IUIStore } from "../interfaces";


export const UIStore: IUIStore = store({
    activeModal: null
});

export const ListComponent = store({
    height: 50,
});

export const UIActions = {
    setActiveModal(modal: any) {
        UIStore.activeModal = modal;
    },
    toggleHeight() {
        ListComponent.height = (ListComponent.height === 50) ? 0 : 50;
    },
    getHeight() {
        return ListComponent.height;
    }

};