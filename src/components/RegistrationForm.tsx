import React, {useState, useRef, useEffect} from 'react';
import { view } from 'react-easy-state';
import { withRouter } from 'react-router-dom';
import { Alert, Form, Card, Button, Row, Col } from "react-bootstrap";

import {AuthActions, AuthStore} from "../stores/auth";
import * as api from "../api";


export const RegistrationForm = withRouter(view((props: any) => {

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [OTP, setOTP] = useState('');
    const [aboutYou, setAboutYou] = useState('');
    const [isOTPVisible, setIsOTPVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const token = AuthStore.token;

    const otpRef = useRef(null);
    const errorRef = useRef(null);

    // check token
    useEffect(() => {
        if (token) {
            props.history.push("/");
        }
    }, [token]);

    // scroll to otp
    useEffect(() => {
        if (isOTPVisible) {
            // @ts-ignore
            otpRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [isOTPVisible]);

    // scroll to error
    useEffect(() => {
        if (errorMessage) {
            // @ts-ignore
            errorRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [errorMessage]);

    const sendOTP = async () => {
        setErrorMessage('');
        try {
            await api.sendOTP(phoneNumber);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        setIsOTPVisible(true);
    };

    const submitOTP = async () => {
        let token: string;
        try {
            token = await api.verifyOTP(name, phoneNumber, aboutYou, OTP);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        AuthActions.setToken(token);
        props.history.push("/")
    };

    return (
        <Card className="h-100 mx-auto">
            <Card.Header>Register</Card.Header>
            <Card.Body className="overflow-auto">
                <Form>
                    { errorMessage && <Alert variant="danger" ref={errorRef}>{ errorMessage }</Alert> }
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
                    <Form.Group>
                        <Form.Label>About You</Form.Label>
                        <Form.Control as="textarea" value={aboutYou}
                                      onChange={(e: any) => setAboutYou(e.target.value)} />
                    </Form.Group>
                    {isOTPVisible &&
                    <Form.Group>
                      <Form.Label>OTP</Form.Label>
                      <Form.Control type="text" value={OTP} ref={otpRef}
                                    onChange={(e: any) => setOTP(e.target.value)} />
                    </Form.Group>}
                </Form>
                {!isOTPVisible &&
                <div className="text-right">
                    <Button variant="success" onClick={sendOTP}>
                      Send OTP
                    </Button>
                </div>}
                {isOTPVisible &&
                <Row className="w-100 mx-0">
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
            </Card.Body>
        </Card>
    )
}));
