import React, {useState, useRef, useEffect} from 'react';
import { view } from 'react-easy-state';
import { withRouter } from 'react-router-dom';
import { Alert, Form, Card, Button, Row, Col, Modal } from "react-bootstrap";

import * as api from "../api";


export const RequestForm = withRouter(view((props: any) => {

    const languages = [
        "English",
        "Telugu",
        "Hindustani"
    ];

    const [citizenName, setCitizenName] = useState('');
    const [language, setLanguage] = useState(languages[0]);
    const [services, setServices] = useState([]);
    const [contactNumber, setContactNumber] = useState('');
    const [service, setService] = useState(services[0]);
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const errorRef = useRef(null);

    const submitRequest = async () => {
        setErrorMessage('');
        try {
            await api.submitRequest(citizenName, contactNumber, language, service, address, comment);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        props.history.push("/");
    };

    // fetch services
    useEffect(() => {
        (async () => {
            const services = await api.listServices();
            setServices(services);
        })()
    });

    // scroll to error
    useEffect(() => {
        if (errorMessage) {
            // @ts-ignore
            errorRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [errorMessage]);

    return (
        <Card className="h-100 mx-auto" style={{maxWidth: "600px"}}>
            <Card.Header>
                <Row>
                    <Col className="my-auto">Create Request</Col>
                    <Col className="text-right">
                        <Button variant="outline-dark" onClick={() => props.history.push("/")}>
                            Back to List
                        </Button>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body className="overflow-auto">
                <Form>
                    <p>
                        Please drag the red marker to the location where assistance is needed,
                        and fill all the fields.
                    </p>
                    <hr />
                    { errorMessage && <Alert variant="danger" ref={errorRef}>{ errorMessage }</Alert> }
                    <Form.Group>
                        <Form.Label>Citizen Name</Form.Label>
                        <Form.Control type="text" placeholder="Who needs help" value={citizenName}
                                      onChange={(e: any) => setCitizenName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control type="text" placeholder="Where to call" value={contactNumber}
                                      onChange={(e: any) => setContactNumber(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Language</Form.Label>
                        <Form.Control as="select"
                                      onChange={(e: any) => setLanguage(e.target.value)}>
                            {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Service</Form.Label>
                        <Form.Control as="select" value={service}
                                      onChange={(e: any) => setService(e.target.value)}>
                            {services.map(s => <option key={s} value={s}>{s}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control as="textarea" placeholder="Address" value={address}
                                      onChange={(e: any) => setAddress(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as="textarea" placeholder="Additional notes" value={comment}
                                      onChange={(e: any) => setComment(e.target.value)} />
                    </Form.Group>
                </Form>
                <div className="text-right">
                    <Button variant="success" onClick={submitRequest}>
                        Submit
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}));
