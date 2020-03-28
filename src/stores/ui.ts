import { store } from "react-easy-state";

import { IUIStore } from "../interfaces";


export const UIStore: IUIStore = store({
    isInitiateVisible: false,
    isVerifyVisible: false,
    isSubmitVisible: false,
});

export const UIActions = {
    setInitiateVisibility(visibility: boolean) {
        UIStore.isInitiateVisible = visibility;
    },
    setVerifyVisibility(visibility: boolean) {
        UIStore.isVerifyVisible = visibility;
    },
    setSubmitVisibility(visibility: boolean) {
        UIStore.isSubmitVisible = visibility;
    }
};
