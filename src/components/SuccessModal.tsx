import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { view } from 'react-easy-state';

import { UIActions, UIStore } from "../stores/ui";


export const SuccessModal = view(() => {

    return (
        <Modal scrollable show={UIStore.activeModal === 'success'} onHide={UIActions.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Request Submitted</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    The person needing the help will receive a phone call to confirm.
                    There might be a time delay in the response, please bear with us.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={UIActions.hideModal}>Finish</Button>
            </Modal.Footer>
        </Modal>
    )
});
