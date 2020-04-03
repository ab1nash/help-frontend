import React, {useState, useEffect} from 'react';
import _ from "lodash";
import { view } from 'react-easy-state';
import { useHistory } from 'react-router-dom';
import {Card, Button, Row, Col, ButtonGroup, DropdownButton, Dropdown, Alert, Form} from "react-bootstrap";
import moment from "moment";

import { CSVLink } from "react-csv";
import * as api from "../api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Select from "react-select";
import {UIActions} from "../stores/ui";


export const RequestList = view(({ all }: { all: boolean }) => {

    const [requests, setRequests] = useState([]);
    const [services, setServices] = useState([]);
    const statusesList = ['Open', 'Closed', 'Cancelled'];
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [citizenContactNumber, setCitizenContactNumber] = useState('');
    const [statuses, setStatuses] = useState(statusesList);
    const [servicesList, setServicesList] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [downloadRequests, setDownloadRequests] = useState([{}]);

    const history = useHistory();

    useEffect(() => {
        (async () => {
            const requestsResponse = await api.listRequests(all);
            const servicesResponse = await api.listServices();
            setRequests(requestsResponse);
            setServices(servicesResponse);
            setServicesList(servicesResponse);
        })();
    }, [all]);

    useEffect(() => {
        setFilteredRequests(requests.filter((request: any) => {
            let shouldShow = statuses.findIndex((s: string) => s === getRequestStatus(request)) >= 0 &&
                services.findIndex((s: string) => s === request.service) >= 0;
            if (shouldShow && userPhoneNumber) {
                shouldShow = request.userPhoneNumber.startsWith(userPhoneNumber);
            }
            if (shouldShow && citizenContactNumber) {
                shouldShow = request.contactNumber.startsWith(citizenContactNumber);
            }
            return shouldShow;
        }))
    }, [requests, statuses, services, userPhoneNumber, citizenContactNumber]);

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

    return (
        <Card className="h-100 mx-auto">
            <Card.Header>
                <Row>
                    <Col className="my-auto">{all ? "All" : "My" } Requests</Col>
                    {requests.length > 0 &&
                    <Col className="justify-content-end d-flex px-0 text-right requests-list-filter">
                      <DropdownButton id="filters-dropdown-button" variant="outline-primary" title="Filters" drop="up" className="mr-2">
                        <Select defaultValue={statusesList.map((s: string) => ({ value: s, label: s }))}
                                options={statusesList.map((s: string) => ({ value: s, label: s }))} className="p-2"
                                isMulti isSearchable={false} closeMenuOnSelect={false} placeholder="Status"
                                onChange={(x: any) => setStatuses(x ? x.map((i: any) => i.value) : [])} />
                        <Select defaultValue={servicesList.map((s: string) => ({ value: s, label: s }))}
                                options={servicesList.map((s: string) => ({ value: s, label: s }))} className="p-2"
                                onChange={(x: any) => setServices(x ? x.map((i: any) => i.value) : [])}
                                isMulti isSearchable={false} closeMenuOnSelect={false} placeholder="Service" />
                          {all &&
                          <div className="p-2">
                            <Form.Control type="text" value={userPhoneNumber} placeholder="User Phone Number"
                                          onChange={(e: any) => setUserPhoneNumber(e.target.value)} />
                          </div>}
                        <div className="p-2">
                          <Form.Control type="text" value={citizenContactNumber} placeholder="Citizen Contact Number"
                                        onChange={(e: any) => setCitizenContactNumber(e.target.value)} />
                        </div>
                      </DropdownButton>
                        {all &&
                        <CSVLink data={filteredRequests.map(request => _.mapValues(request, (value: any) => {
                            if (!value) return value;
                            return value.replace(",", "_").replace('"', '""')                                         ;
                        }))}>
                            <Button variant="primary">
                              <FontAwesomeIcon icon="download" />
                            </Button>
                        </CSVLink>}
                        {!all &&
                        <Button variant="primary" onClick={() => history.push("/create")}>
                          <FontAwesomeIcon icon="plus" />
                        </Button>
                        }
                    </Col>}
                    {requests.length === 0 && !all &&
                    <Button variant="primary" className="ml-auto"
                            onClick={() => history.push("/create")} style={{height: "40px"}}>
                      <FontAwesomeIcon icon="plus" />
                    </Button>}
                </Row>
            </Card.Header>
            <Card.Body className="overflow-auto">
                {requests.length === 0 && !all &&
                <Alert variant="primary" className="text-center">
                  Tap the "+" sign to create a request
                </Alert>}
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
                                <Col xs={7} className="pr-0">
                                    <h5>{request.service}</h5>
                                    <div>{request.comment}</div>
                                </Col>
                                <Col xs={5} className="mt-auto text-right pl-0">
                                    <div>for {request.citizenName}</div>
                                    <a href={`tel:${request.contactNumber}`}>{request.contactNumber}</a>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-center py-2 px-3">
                            {moment.utc(request.createstamp).local().format("ddd, MMM D, h:mm a")} by
                            <a href={`tel:${request.userPhoneNumber}`}> {request.name}</a>
                        </Card.Footer>
                    </Card>
                ))}
            </Card.Body>
        </Card>
    )
});
