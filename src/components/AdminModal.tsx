import React, {useEffect, useState} from 'react';
import { view } from 'react-easy-state';
import {Alert, Button, DropdownButton, Form, Modal} from "react-bootstrap";
import Select from 'react-select';

import * as api from "../api";
import {UIActions, UIStore} from "../stores/ui";


export const AdminModal = view(() => {

    const [admins, setAdmins] = useState([]);
    const [addAdminPhoneNumber, setAddAdminPhoneNumber] = useState('');
    const [removeAdminPhoneNumber, setRemoveAdminPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        getAdmins();
    }, []);

    const getAdmins = async () => {
        const response = await api.getAdmins();
        setAdmins(response);
    };

    const setAdmin = async(finalState: boolean) => {
        setErrorMessage('');
        setSuccessMessage('');
        let name = '';
        try {
            name = await api.setAdmin(finalState ? addAdminPhoneNumber : removeAdminPhoneNumber, finalState)
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        if (finalState) {
            setSuccessMessage(`Got it, ${name} is now an administrator`);
        } else {
            setSuccessMessage(`Got it, ${name} is no longer an administrator`);
        }
        await getAdmins();
    };

    const onHide = () => {
        setErrorMessage('');
        setSuccessMessage('');
        UIActions.setActiveModal(null);
    };

    return (
        <Modal show={UIStore.activeModal === 'admin'} onHide={onHide}>
            <Modal.Header closeButton>
                Settings
            </Modal.Header>
            <Modal.Body>
                { successMessage && <Alert variant="success">{ successMessage }</Alert> }
                { errorMessage && <Alert variant="danger">{ errorMessage }</Alert> }
                <h6 className="mb-3">Add Administrator</h6>
                <Form.Group>
                    <Form.Control type="text" value={addAdminPhoneNumber} placeholder="Phone Number"
                                  onChange={(e: any) => setAddAdminPhoneNumber(e.target.value)} />
                    <Form.Text>This phone number must already be registered</Form.Text>
                    <div className="text-right mt-3">
                        <Button variant="primary" onClick={() => setAdmin(true)}>Make Admin</Button>
                    </div>
                </Form.Group>
                <hr />
                <h6 className="mb-3">Remove Administrator</h6>
                <Form.Group>
                    <Select
                        options={admins.map((a: any) => ({ value: a.phoneNumber, label: `${a.name} - ${a.phoneNumber}` }))}
                        onChange={(x: any) => { setRemoveAdminPhoneNumber(x.value) }} />
                    <div className="text-right mt-3">
                        <Button variant="primary" onClick={() => setAdmin(false)}>Remove Admin</Button>
                    </div>
                </Form.Group>
            </Modal.Body>
        </Modal>
    )
});
