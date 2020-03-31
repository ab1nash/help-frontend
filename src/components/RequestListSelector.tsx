import React from "react";
import { useHistory } from "react-router-dom";
import { view } from "react-easy-state";
import {Button, ButtonGroup} from "react-bootstrap";


export const RequestListSelector = view(() => {

    const history = useHistory();

    return (
        <ButtonGroup className="w-100">
            <Button style={{borderRadius: 0}} variant="outline-primary" onClick={() => history.push("/all")}>All Requests</Button>
            <Button style={{borderRadius: 0}} variant="outline-primary" onClick={() => history.push("/")}>My Requests</Button>
        </ButtonGroup>
    )
});
