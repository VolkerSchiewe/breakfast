import * as React from "react";
import {NavBar} from "../modules/layout/components/NavBar";
import {Login} from "./Login";
import {ElectionListContainerWithRouter} from "../modules/management/containers/ElectionListContainer";
import {EditElectionContainer} from "../modules/management/containers/EditElectionContainer";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import {ProtectedRoute} from "../modules/auth/components/ProtectedRoute";
import {User} from "../modules/auth/services/user";
import {AuthProvider} from "../modules/auth/components/AuthContext";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import {theme} from "../modules/layout/styles/styles";
import {ElectionContainerWithRouter} from "../modules/election/container/ElectionContainer";
import {AdminRoute} from "../modules/auth/components/AdminRoute";
import {CodesContainer} from "../modules/management/containers/CodesContainer";


interface AppState {
    user?: User
}

class App extends React.Component<RouteComponentProps, AppState> {
    render() {
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <AuthProvider>
                        <Switch>
                            <AdminRoute exact path="/elections/:electionId/codes/"
                                        component={CodesContainer}/>
                            <Route path={""} render={() => {
                                return (
                                    <div>
                                        <NavBar title={"Wahlen"}/>
                                        <Switch>
                                            <Route exact path="/login/" component={Login}/>
                                            <ProtectedRoute exact path="/" component={ElectionContainerWithRouter}/>
                                            <AdminRoute exact path="/elections/:electionId/"
                                                        component={EditElectionContainer}/>
                                            <AdminRoute exact path="/elections/"
                                                        component={ElectionListContainerWithRouter}/>

                                        </Switch>
                                    </div>
                                )
                            }}/>
                        </Switch>
                    </AuthProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}

export const AppWithRouter = withRouter(App);