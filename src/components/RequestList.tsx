import React, {useState, useRef, useEffect} from 'react';
import { view } from 'react-easy-state';
import { withRouter } from 'react-router-dom';
import { Alert, Form, Card, Button, Row, Col } from "react-bootstrap";

import * as api from "../api";


export const RequestList = withRouter(view((props: any) => {

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        (async () => {
            const result = await api.listRequests();
            setRequests(result);
        })();
    }, []);

    useEffect(() => {
        setFilteredRequests(requests);
        console.log(requests);
    }, [requests]);

    return (
        <Card className="h-100 mx-auto" style={{maxWidth: "600px"}}>
            <Card.Header>My Requests</Card.Header>
            <Card.Body className="overflow-auto">
                {filteredRequests.map((request: any) => (
                    <Card bg="light" key={request.id} text="dark" className="mb-3">
                        <Card.Header>Request {request.id}</Card.Header>
                        <Card.Body>
                            <Card.Title>{request.service}</Card.Title>
                        </Card.Body>
                    </Card>
                ))}
            </Card.Body>
            <Card.Footer>
                <div className="text-center">
                    <Button variant="primary" onClick={() => props.history.push("/create")}>
                        Create new request
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}));
