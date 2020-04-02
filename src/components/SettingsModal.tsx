import React, {useEffect, useState} from 'react';
import { view } from 'react-easy-state';
import {Alert, Button, Form, Modal} from "react-bootstrap";
import Select from 'react-select';

import * as api from "../api";
import {UIActions, UIStore} from "../stores/ui";


export const SettingsModal = view(() => {

    const [adminPhoneNumber, setAdminPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [servicesList, setServicesList] = useState([]);

    const [statuses, setStatuses] = useState(['']);
    const [services, setServices] = useState(['']);
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [citizenPhoneNumber, setCitizenPhoneNumber] = useState('');

    useEffect(() => {
        (async () => {
            const servicesList = await api.listServices();
            setServicesList(servicesList);
        })()
    }, []);

    const makeAdmin = async() => {
        setErrorMessage('');
        setSuccessMessage('');
        let name = '';
        try {
            name = await api.makeAdmin(adminPhoneNumber)
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setSuccessMessage(`Got it, ${name} is now an administrator`);
    };

    const downloadCSV = async () => {
        return;
        try {
            await api.downloadCSV(statuses, services, userPhoneNumber, citizenPhoneNumber);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
    };

    const onHide = () => {
        setErrorMessage('');
        setSuccessMessage('');
        UIActions.setSettingsModal(false);
    };

    return (
        <Modal show={UIStore.isSettingsModalOpen} onHide={onHide}>
            <Modal.Header closeButton>
                Settings
            </Modal.Header>
            <Modal.Body>
                { successMessage && <Alert variant="success">{ successMessage }</Alert> }
                { errorMessage && <Alert variant="danger">{ errorMessage }</Alert> }
                <h6 className="mb-3">Add Administrator</h6>
                <Form.Group>
                    <Form.Control type="text" value={adminPhoneNumber} placeholder="Phone Number"
                                  onChange={(e: any) => setAdminPhoneNumber(e.target.value)} />
                    <Form.Text>This phone number must already be registered</Form.Text>
                    <div className="text-right mt-3">
                        <Button variant="primary" onClick={makeAdmin}>Make Admin</Button>
                    </div>
                </Form.Group>
                <div>
                    <h6 className="mb-3">Export CSV</h6>
                    <Form.Group className="text-center">
                        <Select isMulti options={[
                            { value: 'Open', label: 'Open' },
                            { value: 'Closed', label: 'Closed' },
                            { value: 'Cancelled', label: 'Cancelled' }
                        ]} placeholder="Status" onChange={(x: any) => setStatuses(x.map((i: any) => i.value))} />
                    </Form.Group>
                    <Form.Group className="text-center">
                        <Select isMulti options={servicesList.map((s: string) => ({
                            value: s, label: s
                        }))} placeholder="Services" onChange={(x: any) => setServices(x.map((i: any) => i.value))} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" value={userPhoneNumber} placeholder="User Phone Number"
                                      onChange={(e: any) => setUserPhoneNumber(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" value={citizenPhoneNumber} placeholder="Citizen Contact Number"
                                      onChange={(e: any) => setCitizenPhoneNumber(e.target.value)} />
                    </Form.Group>
                    <div className="text-right mt-3">
                        <Button variant="primary" onClick={downloadCSV}>Download</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
});
