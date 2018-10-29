import * as React from "react";
import {NavBar} from "../modules/layout/components/NavBar";
import {Login} from "./Login";
import {ElectionListContainerWithRouter} from "../modules/management/containers/ElectionListContainer";
import {EditElectionContainer} from "../modules/management/containers/EditElectionContainer";
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import {ProtectedRoute} from "../modules/auth/components/ProtectedRoute";
import {User} from "../modules/auth/services/user";
import {AuthConsumer, AuthProvider} from "../modules/auth/components/AuthContext";
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "../modules/layout/styles/styles";
import {AuthInterface} from "../modules/auth/interfaces/AuthInterface";
import {ElectionContainer} from "../modules/election/container/ElectionContainer";

interface AppState {
    user?: User
}

class App extends React.Component<RouteComponentProps, AppState> {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <AuthProvider>
                    <AuthConsumer>
                        {({user}: AuthInterface) => (
                            <div>
                                <NavBar title={"Wahlen"}/>
                                <Switch>
                                    <Route exact path="/" render={() => (
                                        <div>
                                            {console.log(user)}
                                            {user && user.isAdmin ? (
                                                <Redirect to="/elections"/>
                                            ) : (
                                                <ElectionContainer/>
                                            )}
                                            {!user &&
                                            <Redirect to="/login"/>
                                            }
                                        </div>
                                    )}/>
                                    <Route exact path="/login/" component={Login}/>
                                    <ProtectedRoute exact path="/elections/:electionId"
                                                    component={EditElectionContainer}/>
                                    <ProtectedRoute exact path="/elections"
                                                    component={ElectionListContainerWithRouter}/>
                                </Switch>
                            </div>
                        )}
                    </AuthConsumer>
                </AuthProvider>
            </MuiThemeProvider>
        );
    }
}

export const AppWithRouter = withRouter(App);