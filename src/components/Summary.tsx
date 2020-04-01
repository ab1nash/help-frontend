import React, {useEffect, useState} from 'react';
import {Badge, Row} from "react-bootstrap";
import { view } from 'react-easy-state';
import { Card } from "react-bootstrap";
import _ from "lodash";

import * as api from "../api";
import {MapActions} from "../stores/map";


export const Summary = view(() => {

    const [summary, setSummary] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        (async () => {
            let result = await api.getSummary();
            console.log(result);
            setSummary(result);
            const summaryMarkers = result.map((entry: any) => {
                return entry.data.map((request: any) => {
                    const coordinates = JSON.parse(request["f2"]);
                    return {
                        coordinates: {
                            lat: coordinates["lat"],
                            lng: coordinates["lng"],
                        },
                        color: getServiceColor(entry["service"]),
                        id: request["f1"].toString()
                    }
                })
            });
            MapActions.setSummary(_.flatten(summaryMarkers));
        })();
    }, []);

    const getBsColor = (color: string) => {
        switch (color) {
            case "red":
                return "danger";
            case "blue":
                return "primary";
            case "black":
                return "dark";
            case "yellow":
                return "warning";
            default:
                return color;
        }
    };

    const getServiceColor = (service: string) => {
        switch(service) {
            case "Medicines":
                return "red";
            case "Emergency":
                return "red";
            case "Food":
                return "blue";
            case "Law and Order":
                return "orange";
            case "Electricity":
                return "black";
            case "Water":
                return "black";
            case "Transport":
                return "brown";
            case "Sewage":
                return "yellow";
            case "Garbage":
                return "yellow";
            default:
                return "";
        }
    };

    return (
        <Card>
            <Card.Body className="p-0">
                <Card.Header className="text-center" onClick={() => setIsVisible(!isVisible)}>Summary</Card.Header>
                {isVisible && <Row className="justify-content-between mx-4 mt-3">
                    {summary.map((entry: any) => (
                        // @ts-ignore
                        <Badge key={entry["service"]} variant={getBsColor(getServiceColor(entry["service"]))} pill={true}
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
