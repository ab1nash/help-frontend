import React, { useState } from 'react';
import {Modal, Form, Button, Row, Alert, Col} from 'react-bootstrap';
import { view } from 'react-easy-state';

import { UIActions, UIStore } from "../stores/ui";
import { AuthActions } from "../stores/auth";
import * as api from "../api";


export const VerifyOTPModal = view(() => {

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('phoneNumber') || '');
    const [OTP, setOTP] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const verifyOTP = async () => {
        let token: string;
        try {
            token = await api.verifyOTP(name, phoneNumber, OTP);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        AuthActions.setUserToken(token);
        UIActions.setVerifyVisibility(false);
        UIActions.setSubmitVisibility(true);
        localStorage.removeItem("phoneNumber");
    };

    const resendOTP = async () => {
        try {
            await api.sendOTP(phoneNumber);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
    };

    return (
        <Modal show={UIStore.isVerifyVisible} onHide={() => UIActions.setVerifyVisibility(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Verify OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    { errorMessage && <Alert variant="danger">{ errorMessage }</Alert> }
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Who to call" value={name} onChange={(e: any) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="Where to call" value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>OTP</Form.Label>
                        <Form.Control type="text" placeholder="OTP from SMS" value={OTP} onChange={(e: any) => setOTP(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Row className="w-100">
                    <Col className="px-0">
                        <Button variant="primary" onClick={resendOTP}>
                            Resend OTP
                        </Button>
                    </Col>
                    <Col className="px-0 text-right">
                        <Button variant="success" onClick={verifyOTP}>
                            Verify
                        </Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    )
});
