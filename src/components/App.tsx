import * as React from "react";
import {NavBar} from "../modules/layout/components/NavBar";
import {Login} from "./Login";
import {ElectionListContainerWithRouter} from "../modules/management/containers/ElectionListContainer";
import {EditElectionContainer} from "../modules/management/containers/EditElectionContainer";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import {ProtectedRoute} from "../modules/auth/components/ProtectedRoute";
import {User} from "../modules/auth/services/user";
import {AuthProvider} from "../modules/auth/components/AuthContext";
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "../modules/layout/styles/styles";

interface AppState {
    user?: User
}

class App extends React.Component<RouteComponentProps, AppState> {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <AuthProvider>
                    <NavBar title={"Wahlen"}/>
                    <Switch>
                        <Route exact path="/login/" component={Login}/>
                        <ProtectedRoute exact path="/elections/:electionId" component={EditElectionContainer}/>
                        <ProtectedRoute exact path="/elections" component={ElectionListContainerWithRouter}/>
                    </Switch>
                </AuthProvider>
            </MuiThemeProvider>
        );
    }
}

export const AppWithRouter = withRouter(App);