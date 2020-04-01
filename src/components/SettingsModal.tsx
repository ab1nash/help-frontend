import React, {useState} from 'react';
import { view } from 'react-easy-state';
import {Alert, Button, Form, Modal} from "react-bootstrap";

import * as api from "../api";
import {UIActions, UIStore} from "../stores/ui";


export const SettingsModal = view(() => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const makeAdmin = async() => {
        setErrorMessage('');
        setSuccessMessage('');
        let name = '';
        try {
            name = await api.makeAdmin(phoneNumber)
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setSuccessMessage(`Got it, ${name} is now an administrator`);
    };

    return (
        <Modal show={UIStore.isSettingsModalOpen} onHide={() => UIActions.setSettingsModal(false)}>
            <Modal.Header closeButton>
                Settings
            </Modal.Header>
            <Modal.Body>
                { successMessage && <Alert variant="success">{ successMessage }</Alert> }
                { errorMessage && <Alert variant="danger">{ errorMessage }</Alert> }
                <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" value={phoneNumber}
                                  onChange={(e: any) => setPhoneNumber(e.target.value)} />
                </Form.Group>
                <div className="text-right">
                    <Button variant="primary" onClick={makeAdmin}>Make Admin</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
});
