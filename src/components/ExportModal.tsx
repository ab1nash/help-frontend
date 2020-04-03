import React, {useEffect, useState} from 'react';
import { view } from 'react-easy-state';
import {Alert, Button, DropdownButton, Form, Modal} from "react-bootstrap";
import Select from 'react-select';

import * as api from "../api";
import {UIActions, UIStore} from "../stores/ui";


export const ExportModal = view(() => {

    const statusesList = ["Open", "Closed", "Cancelled"];
    const [servicesList, setServicesList] = useState([]);

    const [statuses, setStatuses] = useState(['']);
    const [services, setServices] = useState(['']);
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [citizenPhoneNumber, setCitizenPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        (async () => {
            const servicesList = await api.listServices();
            setServicesList(servicesList);
        })()
    }, []);

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
        UIActions.setActiveModal(null);
    };

    return (
        <Modal show={false} onHide={onHide}>
            <Modal.Header closeButton>
                Settings
            </Modal.Header>
            <Modal.Body>
                { successMessage && <Alert variant="success">{ successMessage }</Alert> }
                { errorMessage && <Alert variant="danger">{ errorMessage }</Alert> }
                <h6 className="mb-3">Export CSV</h6>
                <Form.Group className="text-center">
                    <Select defaultValue={statusesList.map((s: string) => ({ value: s, label: s }))}
                            options={statusesList.map((s: string) => ({ value: s, label: s }))} className="px-3"
                            isMulti isSearchable={false} closeMenuOnSelect={false} placeholder="Status"
                            onChange={(x: any) => setStatuses(x ? x.map((i: any) => i.value) : [])} />
                </Form.Group>
                <Form.Group className="text-center">
                    <Select defaultValue={servicesList.map((s: string) => ({ value: s, label: s }))}
                            options={servicesList.map((s: string) => ({ value: s, label: s }))} className="px-3"
                            onChange={(x: any) => setServices(x ? x.map((i: any) => i.value) : [])}
                            isMulti isSearchable={false} closeMenuOnSelect={false} placeholder="Service" />
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
                    <Button variant="primary" onClick={downloadCSV} disabled>Download</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
});
