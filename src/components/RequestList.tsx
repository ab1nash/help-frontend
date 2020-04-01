import React, {useState, useEffect} from 'react';
import _ from "lodash";
import { view } from 'react-easy-state';
import { useHistory } from 'react-router-dom';
import { Card, Button, Row, Col, ButtonGroup, DropdownButton, Dropdown } from "react-bootstrap";
import moment from "moment";

import * as api from "../api";


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

    useEffect(() => {
        setFilteredRequests(requests);
    }, [requests]);

    return (
        <Card className="h-100 mx-auto" style={{maxWidth: "600px"}}>
            <Card.Header>
                <Row>
                    <Col className="my-auto">{all ? "All" : "My" } Requests</Col>
                    <Col className="text-right">
                        {!all && <Button variant="primary" className="mx-auto" onClick={() => history.push("/create")}>
                            New Request
                        </Button>}
                    </Col>
                </Row>
            </Card.Header>
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
                    <Card bg="light" key={request.id} text="dark" className="mb-3" onClick={() => history.push(`/view/${request.id}`)}>
                        <Card.Header>
                            <Row>
                                <Col>Request {request.id}</Col>
                                <Col className="text-right">{getRequestStatus(request)}</Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>{request.service}</Card.Title>
                            <div className="mt-2">{request.comment}</div>
                            <hr />
                            Filed by: {request.userPhoneNumber}
                        </Card.Body>
                        <Card.Footer className="text-center">
                            Opened at {moment.utc(request.createstamp).local().format("dddd, MMMM Do, h:mm a")}
                        </Card.Footer>
                    </Card>
                ))}
            </Card.Body>
        </Card>
    )
});
