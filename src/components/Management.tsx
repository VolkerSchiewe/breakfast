import * as React from "react";
import {NavBar} from "../modules/layout/NavBar";
import {MuiThemeProvider} from "@material-ui/core/styles";
import {theme} from "../modules/layout/styles";
import {ElectionListContainer} from "../modules/management/containers/ElectionListContainer";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {EditElectionContainer} from "../modules/management/containers/EditElectionContainer";

interface ManagementProps {
    name?: string
}

export const Management = ({name}: ManagementProps) => (
    <MuiThemeProvider theme={theme}>
        <Router>
            <div>
                <NavBar title={"Wählen"}/>

                <Route exact path="/" component={ElectionListContainer}/>
                <Route exact path="/election/:electionId" component={EditElectionContainer}/>
            </div>
        </Router>
    </MuiThemeProvider>
);
