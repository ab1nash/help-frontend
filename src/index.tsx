import React from 'react';
import ReactDOM from 'react-dom';
import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter as Router } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import icons from './icons';
import './index.css';
import { App } from './App';
import {LoadScript} from "@react-google-maps/api";


icons.map((icon: any) => library.add(icon));

const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ["drawing", "places"];

ReactDOM.render(
    <LoadScript googleMapsApiKey={googleMapsAPIKey} libraries={libraries}>
        <Router>
            <App />
        </Router>
    </LoadScript>,
    document.getElementById('root')
);
