import React from 'react';
import { view } from "react-easy-state";
import { Button } from "react-bootstrap";

import { UIActions } from "../stores/ui";
import { AuthStore } from "../stores/auth";

export const InitiateButton = view(() => {

    const initiate = () => {
        if (AuthStore.token) {
            UIActions.showRequest();
        } else {
            UIActions.showOTP();
        }
    };

    return (
        <Button onClick={initiate} variant="primary" className="position-absolute" size="lg"
            style={{bottom: "10px", left: "50%", transform: "translateX(-50%)"}}>
            Initiate Request
        </Button>
    )
});
