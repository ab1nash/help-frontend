import React, {useState, useEffect} from 'react';
import _ from "lodash";
import { view } from 'react-easy-state';
import { useHistory } from 'react-router-dom';
import {Card, Button, Row, Col, ButtonGroup, DropdownButton, Dropdown, Alert} from "react-bootstrap";
import moment from "moment";

import * as api from "../api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export const RequestList = view(({ all }: { all: boolean }) => {

    const [requests, setRequests] = useState([]);
    const [services, setServices] = useState([]);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState({
        "Open": true,
        "Closed": true,
        "Cancelled": true
    });
    const [filteredRequests, setFilteredRequests] = useState([]);

    const history = useHistory();

    useEffect(() => {
        (async () => {
            const requests = await api.listRequests(all);
            const services = await api.listServices();
            setRequests(requests);
            setServices(services);
        })();
    }, [all]);

    useEffect(() => {
        setFilteredRequests(requests.filter((request: any) => {
            let shouldShow = true;
            if (shouldShow) {
                shouldShow = category ? request.service === category : true;
            }
            if (shouldShow) {
                shouldShow = status[getRequestStatus(request)]
            }
            return shouldShow;
        }))
    }, [category, status]);

    const getRequestStatus = (request: any) => {
        if (request.cancelstamp) {
            return "Cancelled";
        } else if (request.closestamp) {
            return "Closed";
        } else {
            return "Open";
        }
    };

    const getBorderColor = (request: any) => {
        const status = getRequestStatus(request);
        if (status === "Open") {
            return "primary";
        } else if (status === "Closed") {
            return "success";
        } else if (status === "Cancelled") {
            return "warning";
        }
    };

    useEffect(() => {
        setFilteredRequests(requests);
    }, [requests]);

    return (
        <Card className="h-100 mx-auto">
            <Card.Header>
                <Row>
                    <Col xs={4} className="my-auto">{all ? "All" : "My" } Requests</Col>
                    {requests.length > 0 && <Col xs={8} className="justify-content-around d-flex px-0 text-right">
                      <DropdownButton as={ButtonGroup} size="sm" variant="secondary" title={category || "All Services"} id="category-dropdown"
                                      style={{height: "40px"}}>
                          {services.map(service => <Dropdown.Item key={service} onClick={(e: any) => setCategory(e.target.text)}>{service}</Dropdown.Item>)}
                        <Dropdown.Item onClick={() => setCategory("")}>All Services</Dropdown.Item>
                      </DropdownButton>
                      <DropdownButton as={ButtonGroup}  variant="secondary" title="Status" id="status-dropdown"
                                      style={{height: "40px"}}>
                        <Dropdown.Item onClick={() => setStatus(_.extend( {}, status, {"Open": !status["Open"]}))}>
                            {status["Open"] ? "Hide" : "Show"} Open
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatus(_.extend( {}, status, {"Closed": !status["Closed"]}))}>
                            {status["Closed"] ? "Hide" : "Show"} Closed
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setStatus(_.extend( {}, status, {"Cancelled": !status["Cancelled"]}))}>
                            {status["Cancelled"] ? "Hide" : "Show"} Cancelled
                        </Dropdown.Item>
                      </DropdownButton>
                        {!all && <Button variant="primary" size="sm" onClick={() => history.push("/create")}
                                         style={{height: "40px"}}>
                          <FontAwesomeIcon icon="plus" />
                        </Button>}
                    </Col>}
                    {!requests.length && !all &&
                    <Button variant="primary" className="ml-auto"
                            onClick={() => history.push("/create")} style={{height: "40px"}}>
                      <FontAwesomeIcon icon="plus" />
                    </Button>}
                </Row>
            </Card.Header>
            <Card.Body className="overflow-auto">
                {!requests.length && !all &&
                <Alert variant="primary" className="text-center">
                  Tap the "+" sign to create a request
                </Alert>
                }
                {requests.length > 0 && filteredRequests.length === 0 &&
                <Alert variant="primary" className="text-center">
                  No requests match the selected filters
                </Alert>}
                {filteredRequests.map((request: any) => (
                    <Card bg="light" border={getBorderColor(request)} key={request.id} text="dark" className="mb-3" onClick={() => history.push(`/view/${request.id}`)}>
                        <Card.Header>
                            <Row>
                                <Col>Request {request.id}</Col>
                                <Col className="text-right">{getRequestStatus(request)}</Col>
                            </Row>
                        </Card.Header>
                        <Card.Body className="py-2 px-3">
                            <Row>
                                <Col xs={7}>
                                    <h5>{request.service}</h5>
                                    <div>{request.comment}</div>
                                </Col>
                                <Col xs={5} className="text-right">
                                    <div>{request.name}</div>
                                    <div>{request.userPhoneNumber}</div>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-center py-2 px-3">
                            Opened at {moment.utc(request.createstamp).local().format("dddd, MMM D, h:mm a")}
                        </Card.Footer>
                    </Card>
                ))}
            </Card.Body>
        </Card>
    )
});
