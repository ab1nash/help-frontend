import React, {useState, useRef, useEffect} from 'react';
import moment from "moment";
import { view } from 'react-easy-state';
import { useHistory, useParams } from 'react-router-dom';
import {Alert, Form, Card, Button, Row, Col, DropdownButton, ButtonGroup, Dropdown, Table} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as api from "../api";
import {MapActions, MapStore} from "../stores/map";


export const RequestForm = view(({ fill }: { fill: boolean }) => {

    const languages = [
        "English",
        "Telugu",
        "Hindustani"
    ];

    const { id } = useParams();
    const [stamps, setStamps] = useState({
        "createstamp": "",
        "cancelstamp": "",
        "closestamp": ""
    });

    const [citizenName, setCitizenName] = useState('');
    const [language, setLanguage] = useState(languages[0]);
    const [services, setServices] = useState([]);
    const [contactNumber, setContactNumber] = useState('');
    const [service, setService] = useState(services[0]);
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const history = useHistory();
    const errorRef = useRef(null);

    const submitRequest = async () => {
        setErrorMessage('');
        try {
            if (MapStore.lat && MapStore.lng) {
                await api.submitRequest(citizenName, contactNumber, language, service, address, comment);
            } else {
                return setErrorMessage("Please set the location by using search or allowing geolocation permission");
            }
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        history.push("/");
    };

    const updateRequest = async () => {
        setErrorMessage('');
        try {
            await api.updateRequest(id!, citizenName, contactNumber, language, service, address, comment);
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
        history.push("/");
    };

    const loadRequest = async () => {
        let request;
        try {
            request = await api.getRequest(id!);
        } catch (e) {
            return history.push("/")
        }
        setCitizenName(request.citizenName);
        setLanguage(request.language);
        setService(request.service);
        setContactNumber(request.contactNumber);
        setAddress(request.address);
        setComment(request.comment);
        setStamps({
            "createstamp": request.createstamp,
            "cancelstamp": request.cancelstamp,
            "closestamp": request.closestamp,
        });
        const location = JSON.parse(request.location);
        MapActions.setMarkerPosition(location.lat, location.lng);
    };

    const getRequestStatus = () => {
        if (stamps.cancelstamp) {
            return "Cancelled";
        } else if (stamps.closestamp) {
            return "Closed";
        } else {
            return "Open";
        }
    };

    const updateRequestStatus = async (stamp: any) => {
        const currentTime = new Date().toISOString();
        const newStamps: any = {
            "createstamp": stamps.createstamp,
            "cancelstamp": "",
            "closestamp": "",
        };
        newStamps[stamp] = currentTime;
        setErrorMessage('');
        try {
            await api.updateRequestStatus(id!, newStamps);
            await loadRequest();
        } catch (e) {
            return setErrorMessage(e.response.data || e.statusText || e.status);
        }
        setErrorMessage('');
    };

    useEffect(() => {
        if (!fill) return;
        (async () => {
            try {
                await loadRequest();
            } catch (e) {
                return setErrorMessage(e.response.data || e.statusText || e.status);
            }
        })()
    }, []);

    // fetch services
    useEffect(() => {
        (async () => {
            const services = await api.listServices();
            setServices(services);
        })()
    }, []);

    useEffect(() => {
        setService(services[0]);
    }, [services]);

    // scroll to error
    useEffect(() => {
        if (errorMessage) {
            // @ts-ignore
            errorRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [errorMessage]);

    return (
        <Card className="h-100 mx-auto">
            <Card.Header className="justify-content-between d-flex">
                <Button variant="primary" onClick={() => history.push("/")}>
                    <b>&lt;</b>
                </Button>
                <div className="my-auto">
                    {fill ? `Request ${id} - ${getRequestStatus()}` : "Create Request"}
                </div>
                {fill &&
                <DropdownButton as={ButtonGroup}  variant="outline-primary" title="Status" id="status-dropdown" className="d-inline-block">
                  <Dropdown.Item onClick={async (e: any) => {await updateRequestStatus(e.target.id)}} id="createstamp">Open</Dropdown.Item>
                  <Dropdown.Item onClick={async (e: any) => {await updateRequestStatus(e.target.id)}} id="closestamp">Closed</Dropdown.Item>
                  <Dropdown.Item onClick={async (e: any) => {await updateRequestStatus(e.target.id)}} id="cancelstamp">Cancelled</Dropdown.Item>
                </DropdownButton>}
                {!fill && <span />}
            </Card.Header>
            <Card.Body className="overflow-auto">
                <Form>
                    {!fill && <p>
                      Please drag the red marker to the location where assistance is needed,
                      and fill all the fields.
                    </p>}
                    <Table className="border-bottom">
                        <tbody>
                        {stamps.createstamp && <tr>
                          <td>Opened</td>
                          <td>{moment.utc(stamps.createstamp).local().format("dddd, MMMM Do, h:mm a")}</td>
                        </tr>}
                        {stamps.closestamp && <tr>
                          <td>Closed</td>
                          <td>{moment.utc(stamps.closestamp).local().format("dddd, MMMM Do, h:mm a")}</td>
                        </tr>}
                        {stamps.cancelstamp && <tr>
                          <td>Cancelled</td>
                          <td>{moment.utc(stamps.cancelstamp).local().format("dddd, MMMM Do, h:mm a")}</td>
                        </tr>}
                        </tbody>
                    </Table>
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
                    {fill && <Button variant="success" onClick={updateRequest}>Update</Button>}
                    {!fill && <Button variant="success" onClick={submitRequest}>Submit</Button>}
                </div>
            </Card.Body>
        </Card>
    )
});
