import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.scss"
import {AppWithRouter} from "./components/App";
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./modules/layout/styles/styles";
import {BrowserRouter} from 'react-router-dom'

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <BrowserRouter>
            <AppWithRouter/>
        </BrowserRouter>
    </MuiThemeProvider>,
    document.getElementById("container")
)
;