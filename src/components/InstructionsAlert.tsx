import React from 'react';
import { view } from 'react-easy-state';
import { Alert } from "react-bootstrap";


export const InstructionsAlert = view(() => {

    return (
        <Alert variant="primary" className="position-absolute my-auto"
               style={{top: "10px", right: "10px", maxHeight: "80px", zIndex: 1}}>
            Please drag the red pin to the location where assistance is needed.
        </Alert>
    )
});
