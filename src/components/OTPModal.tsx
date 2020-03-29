import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { view } from 'react-easy-state';

import { UIActions, UIStore } from "../stores/ui";
import * as api from "../api";
import {AuthActions} from "../stores/auth";


export const OTPModal = view(() => {

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [OTP, setOTP] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [isOTPVisible, setIsOTPVisible] = useState(false);

    const sendOTP = async () => {
        try {
            await api.sendOTP(name, phoneNumber);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        setIsOTPVisible(true);
    };

    const submitOTP = async () => {
        let token: string;
        try {
            token = await api.verifyOTP(name, phoneNumber, OTP);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        AuthActions.setToken(token);
        UIActions.hideModal();
    };

    return (
        <Modal scrollable backdrop="static" show={UIStore.activeModal === 'otp'} onHide={UIActions.hideModal}>
            <Modal.Header>
                <Modal.Title>Verification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <p>Please enter your name and mobile number to generate an OTP for the verification process.</p>
                    <p>This is a <b>mandatory</b> step before filing requests.</p>
                    { errorMessage && <Alert variant="danger">{ errorMessage }</Alert> }
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={name}
                                      onChange={(e: any) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control type="text" value={phoneNumber}
                                      onChange={(e: any) => setPhoneNumber(e.target.value)} />
                    </Form.Group>
                    {isOTPVisible &&
                    <Form.Group>
                        <Form.Label>OTP</Form.Label>
                        <Form.Control type="text" value={OTP}
                                      onChange={(e: any) => setOTP(e.target.value)} />
                    </Form.Group>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {!isOTPVisible &&
                <Button variant="success" onClick={sendOTP}>
                  Send OTP
                </Button>}
                {isOTPVisible &&
                <Row className="w-100">
                    <Col className="px-0">
                      <Button variant="primary" onClick={sendOTP}>
                        Resend
                      </Button>
                    </Col>
                    <Col className="px-0 text-right">
                      <Button variant="success" onClick={submitOTP}>
                        Submit OTP
                      </Button>
                    </Col>
                </Row>}
            </Modal.Footer>
        </Modal>
    )
});
