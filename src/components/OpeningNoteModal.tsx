import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { view } from 'react-easy-state';

import { UIActions, UIStore } from "../stores/ui";
import { AuthStore } from "../stores/auth";


export const OpeningNoteModal = view(() => {

    const enter = () => {
        if (AuthStore.token) {
            UIActions.hideModal();
        } else {
            UIActions.showOTP();
        }
    };

    return (
        <Modal scrollable show={UIStore.activeModal === 'opening-note'} onHide={UIActions.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    This app is designed to convey requirements by senior citizens staying alone,
                    or the needy, to citizen help groups coordinating assistance.
                </p>
                <p>
                    Please do not send requests if you or a family member is healthy to walk to the nearest shop.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={enter}>Enter</Button>
            </Modal.Footer>
        </Modal>
    )
});
