import * as React from "react";
import {NavBar} from "../modules/layout/components/NavBar";
import {LoginWithRouter} from "./Login";
import {ElectionListContainerWithRouter} from "../modules/management/containers/ElectionListContainer";
import {EditElectionContainer} from "../modules/management/containers/EditElectionContainer";
import {Route, Switch} from "react-router-dom";
import {style} from "typestyle";
import {ProtectedRoute} from "../modules/auth/components/ProtectedRoute";
import {getToken} from "../modules/utils/http";

interface AppState {
    isAuthenticated: boolean
}

const styles = {
    root: style({
        width: '100%',
        height: '100%',
    }),
};

export class App extends React.Component<{}, AppState> {
    constructor(props) {
        super(props);
        const token = getToken();
        const isAuthenticated = token !== '' || token != undefined;

        this.state = {
            isAuthenticated: isAuthenticated,
        }
    }

    handleLogin = () => {
        this.setState({
            isAuthenticated: true
        })
    };

    render() {
        const {isAuthenticated} = this.state;
        return (
            <div className={styles.root}>
                <NavBar title={"Wahlen"}/>
                <Switch>
                    <Route exact path="/login" render={() => <LoginWithRouter handleLogin={this.handleLogin}/>}/>
                    <ProtectedRoute isAuthenticated={isAuthenticated} path="/elections/:electionId"
                                    component={EditElectionContainer}/>
                    <ProtectedRoute exact path="/" component={ElectionListContainerWithRouter}
                                    isAuthenticated={isAuthenticated}/>
                </Switch>
            </div>
        );
    }
}
