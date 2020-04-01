import React, {useEffect, useState} from 'react';
import {Badge, Row} from "react-bootstrap";
import { view } from 'react-easy-state';
import { Card } from "react-bootstrap";
import _ from "lodash";

import * as api from "../api";


export const Summary = view(() => {

    const [summary, setSummary] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        (async () => {
            let result = await api.getSummary();
            setSummary(result);
        })();
    }, []);

    const getServiceColor = (service: string) => {
        switch(service) {
            case "Medicines":
                return "brown";
            case "Emergency":
                return "danger";
            case "Food":
                return "primary";
            case "Law and Order":
                return "orange";
            case "Electricity":
                return "dark";
            case "Water":
                return "dark";
            case "Transport":
                return "primary";
            case "Sewage":
                return "warning";
            case "Garbage":
                return "warning";
            default:
                return "dark"
        }
    };

    return (
        <Card>
            <Card.Body className="p-0">
                <Card.Header className="text-center" onClick={() => setIsVisible(!isVisible)}>Summary</Card.Header>
                {isVisible && <Row className="justify-content-between mx-4 mt-3">
                    {summary.map((entry: any) => (
                        // @ts-ignore
                        <Badge key={entry["service"]} variant={getServiceColor(entry["service"])} pill={true}
                               style={{width: "120px"}} className="mb-2">
                            {entry["service"]} | {entry["data"].length}
                        </Badge>
                    ))}
                    {!summary.length && <p>No requests yet</p>}
                </Row>}
            </Card.Body>
        </Card>
    )
});
