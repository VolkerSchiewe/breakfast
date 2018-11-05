import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.scss"
import {AppWithRouter} from "./components/App";
import {BrowserRouter} from 'react-router-dom'

ReactDOM.render(
    <BrowserRouter>
        <AppWithRouter/>
    </BrowserRouter>,
    document.getElementById("container")
);