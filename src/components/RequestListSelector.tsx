import React from "react";
import { useHistory } from "react-router-dom";
import { view } from "react-easy-state";
import {Button, ButtonGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {UIActions} from "../stores/ui";


export const RequestListSelector = view(() => {

    const history = useHistory();

    return (
        <ButtonGroup className="w-100">
            <Button style={{borderRadius: 0}} variant="outline-primary" onClick={() => history.push("/all")}>All Requests</Button>
            <Button style={{borderRadius: 0}} variant="outline-primary" onClick={() => history.push("/")}>My Requests</Button>
            <Button variant="outline-primary" onClick={() => UIActions.setActiveModal('admin')}>
                <FontAwesomeIcon icon="user" />
            </Button>
            <Button variant="outline-primary" onClick={() => UIActions.setActiveModal('export')}>
                <FontAwesomeIcon icon="download" />
            </Button>
        </ButtonGroup>
    )
});
