import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.scss"
import {App} from "./components/App";
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./modules/layout/styles/styles";
import {BrowserRouter} from 'react-router-dom'

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </MuiThemeProvider>,
    document.getElementById("container")
)
;