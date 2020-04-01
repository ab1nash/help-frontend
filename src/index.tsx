import React from 'react';
import ReactDOM from 'react-dom';
import { library } from "@fortawesome/fontawesome-svg-core";

import 'bootstrap/dist/css/bootstrap.min.css';
import icons from './icons';
import './index.css';
import { App } from './App';


icons.map((icon: any) => library.add(icon));

ReactDOM.render(<App />, document.getElementById('root'));
