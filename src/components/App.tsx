import * as React from "react";
import {NavBar} from "../modules/layout/components/NavBar";
import {Login} from "./Login";
import {ElectionListContainerWithRouter} from "../modules/management/containers/ElectionListContainer";
import {EditElectionContainer} from "../modules/management/containers/EditElectionContainer";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import {style} from "typestyle";
import {ProtectedRoute} from "../modules/auth/components/ProtectedRoute";
import {User} from "../modules/auth/services/user";
import {AuthProvider} from "../modules/auth/components/AuthContext";

interface AppState {
    user?: User

}

const styles = {
    root: style({
        width: '100%',
        height: '100%',
    }),
};

class App extends React.Component<RouteComponentProps, AppState> {
    render() {
        return (
            <div className={styles.root}>
                <AuthProvider>
                    <NavBar title={"Wahlen"}/>
                    <Switch>
                        <Route exact path="/login/" component={Login}/>
                        <ProtectedRoute path="/elections/:electionId"
                                        component={EditElectionContainer}/>
                        <ProtectedRoute exact path="/elections" component={ElectionListContainerWithRouter}/>
                    </Switch>
                </AuthProvider>
            </div>
        );
    }
}

export const AppWithRouter = withRouter(App);