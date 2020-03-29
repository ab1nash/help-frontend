import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { view } from "react-easy-state";
import { Button } from "react-bootstrap";

import { UIActions } from "../stores/ui";

export const InitiateRequestButton = view(() => {

    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    return (
        <Button
            variant="primary" className="position-absolute" size="lg"
            style={ isTabletOrMobile ? {bottom: "10px", left: "50%", transform: "translateX(-50%)"} : {top: "10px", right: "10px"}}
            onClick={UIActions.showInitiate} >
            Initiate Request
        </Button>
    )
});
