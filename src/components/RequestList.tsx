import React, {useState, useEffect} from 'react';
import _ from "lodash";
import { view } from 'react-easy-state';
import { withRouter } from 'react-router-dom';
import { Card, Button, Row, Col, ButtonGroup, DropdownButton, Dropdown } from "react-bootstrap";

import * as api from "../api";


export const RequestList = withRouter(view((props: any) => {

    const [requests, setRequests] = useState([]);
    const [services, setServices] = useState([]);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState({
        "Open": true,
        "Closed": true,
        "Cancelled": true
    });
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        (async () => {
            const requests = await api.listRequests();
            const services = await api.listServices();
            setRequests(requests);
            setServices(services);
        })();
    }, []);

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

    useEffect(() => {
        setFilteredRequests(requests);
    }, [requests]);

    return (
        <Card className="h-100 mx-auto" style={{maxWidth: "600px"}}>
            <Card.Header>My Requests</Card.Header>
            <Card.Body className="overflow-auto">

                <Row className="justify-content-around">

                    <DropdownButton as={ButtonGroup} size="sm" variant="secondary" title={category || "Category"} id="category-dropdown">
                        <Dropdown.Item onClick={() => setCategory("")}>All</Dropdown.Item>
                        {services.map(service => <Dropdown.Item key={service} onClick={(e: any) => setCategory(e.target.text)}>{service}</Dropdown.Item>)}
                    </DropdownButton>

                    <DropdownButton as={ButtonGroup}  variant="secondary" title="Status" id="status-dropdown">
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

                </Row>
                <hr />
                {filteredRequests.map((request: any) => (
                    <Card bg="light" key={request.id} text="dark" className="mb-3">
                        <Card.Header>
                            <Row>
                                <Col>Request {request.id}</Col>
                                <Col className="text-right">{getRequestStatus(request)}</Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>{request.service}</Card.Title>
                            <div className="mt-2">{request.comment}</div>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col>{request.citizenName}</Col>
                                <Col className="text-right">{request.contactNumber}</Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                ))}
                <div className="text-center">
                    <Button variant="primary" onClick={() => props.history.push("/create")}>
                        Create new request
                    </Button>
                </div>
            </Card.Body>
        </Card>
    )
}));
