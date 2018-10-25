import * as React from 'react';
import {AuthInterface} from "../interfaces/AuthInterface";
import {deleteToken, getToken, storeToken} from "../../utils/http";
import {AuthService} from "../services/auth-service";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

interface AuthProviderState extends AuthInterface {
    snackbarOpen: boolean
}

const {Provider, Consumer} = React.createContext<AuthInterface>({
    isLoading: false,
    login: (user, password) => {
        throw new Error('login() not implemented');
    },
    logout: () => {
        throw new Error('logout() not implemented');
    }
});

export const AuthConsumer = Consumer;

class AuthProviderComponent extends React.Component<RouteComponentProps, AuthProviderState> {
    authService = new AuthService();
    login = (name: string, password: string) => {
        this.setState({isLoading: false, error: null});
        this.authService.login(name, password)
            .then(res => {
                storeToken(res.token);
                this.setState({
                    user: res.user,
                    isLoading: false,
                });
                this.props.history.push('/elections');
            })
            .catch(err => {
                err.json().then(res =>
                    this.setState({isLoading: false, error: res, snackbarOpen: true})
                )
            });
    };
    logout = () => {
        this.setState({
            user: null,
            isLoading: true,
            error: null,
        });
        this.authService.logout()
            .then(res => {
                deleteToken();
                this.setState({isLoading: false, error: null});
                this.props.history.push('/login/')
            })
            .catch(err => {
                err.json().then(res =>
                    this.setState({isLoading: false, error: err.message, snackbarOpen: true})
                )
            })
    };
    onSnackbarClose = () => {
        this.setState({snackbarOpen: false})
    };

    constructor(props) {
        super(props);
        const token = getToken();
        this.state = {
            user: token ? {username: '', isAdmin: true} : null,
            error: null,
            isLoading: false,
            snackbarOpen: false,

            login: this.login,
            logout: this.logout,
        }
    }

    render() {
        const {snackbarOpen, error} = this.state;
        return (
            <div>
                <Provider value={this.state}>
                    {this.props.children}
                </Provider>
                <Snackbar open={snackbarOpen} message={<span>{error}</span>} autoHideDuration={5000}
                          onClose={this.onSnackbarClose}/>
            </div>
        );
    }
}

export const AuthProvider = withRouter((AuthProviderComponent));
