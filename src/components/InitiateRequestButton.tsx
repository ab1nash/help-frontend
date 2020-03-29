import React from 'react';
import { view } from "react-easy-state";
import { Button } from "react-bootstrap";

import { MapStore } from "../stores/map";
import { UIActions } from "../stores/ui";

export const InitiateRequestButton = view(() => {
    return (
        <Button
            variant="primary" className="position-absolute" style={{top: "10px", right: "10px"}} size="lg"
            onClick={UIActions.showInitiate} >
            Initiate Request
        </Button>
    )
});

