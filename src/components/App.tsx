import * as React from "react";
import {NavBar} from "../modules/layout/components/NavBar";
import {Login} from "./Login";
import {ElectionListContainerWithRouter} from "../modules/management/containers/ElectionListContainer";
import {EditElectionContainer} from "../modules/management/containers/EditElectionContainer";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import {style} from "typestyle";
import {ProtectedRoute} from "../modules/auth/components/ProtectedRoute";
import {deleteToken, getToken, storeToken} from "../modules/utils/http";
import {AuthProvider} from "../modules/auth/components/AuthContext";
import {AuthService} from "../modules/auth/services/auth-service";

interface AppState {
    isAuthenticated: boolean
    isAdmin: boolean
}

const styles = {
    root: style({
        width: '100%',
        height: '100%',
    }),
};

class App extends React.Component<RouteComponentProps, AppState> {
    authService = new AuthService();
    handleLogin = (name: string, password: string) => {
        this.authService.login(name, password).then(
            res => {
                console.log(res);
                storeToken(res.token);
                this.setState({
                    isAuthenticated: true,
                    isAdmin: res.user.isAdmin,
                });
                this.props.history.push('/');

            });
    };
    handleLogout = () => {
        this.setState({
            isAuthenticated: false,
            isAdmin: false,
        });
        this.authService.logout()
            .then(res => {
                deleteToken();
                console.log(res)
                // this.props.history.push('/login/')
            })
    };

    constructor(props) {
        super(props);
        const token = getToken();
        const isAuthenticated = token !== '' && token != undefined;

        this.state = {
            isAuthenticated: isAuthenticated,
            isAdmin: false
        }
    }

    render() {
        const {isAuthenticated, isAdmin} = this.state;
        return (
            <div className={styles.root}>
                <AuthProvider value={{
                    isAuthenticated: isAuthenticated,
                    isAdmin: isAdmin,
                    login: this.handleLogin,
                    logout: this.handleLogout,
                }}>
                    <NavBar title={"Wahlen"}/>
                    <Switch>
                        <Route exact path="/login/" component={Login}/>
                        <ProtectedRoute path="/elections/:electionId"
                                        component={EditElectionContainer}/>
                        <ProtectedRoute exact path="/" component={ElectionListContainerWithRouter}/>
                    </Switch>
                </AuthProvider>
            </div>
        );
    }
}

export const AppWithRouter = withRouter(App);