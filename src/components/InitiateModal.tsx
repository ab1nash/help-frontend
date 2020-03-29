import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { view } from 'react-easy-state';

import { UIActions, UIStore } from "../stores/ui";
import * as api from "../api";


export const InitiateModal = view(() => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const sendOTP = async () => {
        try {
            await api.sendOTP(phoneNumber);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        localStorage.setItem("phoneNumber", phoneNumber);
        UIActions.showVerify();
    };

    return (
        <Modal show={UIStore.activeModal === 'initiate'} onHide={UIActions.hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Initiate Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    { errorMessage && <Alert variant="danger">{ errorMessage }</Alert> }
                    <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="Where to call" value={phoneNumber}
                                      onChange={(e: any) => setPhoneNumber(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Row className="w-100">
                    <Col className="px-0">
                        <Button variant="primary" onClick={UIActions.showVerify}>
                            Already have OTP?
                        </Button>
                    </Col>
                    <Col className="px-0 text-right">
                        <Button variant="success" onClick={sendOTP}>
                            Send OTP
                        </Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
});
