import * as React from 'react';
import {AuthInterface} from "../interfaces/AuthInterface";
import {AuthService} from "../services/auth-service";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Snackbar from "@mui/material/Snackbar/Snackbar";
import {deleteUserData, getUserData, storeUserData} from "../../utils/auth";

interface AuthProviderState extends AuthInterface {
}

const {Provider, Consumer} = React.createContext<AuthInterface>({
    isLoading: false,
    login: () => {
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
        this.setState({isLoading: true, error: null});
        this.authService.login(name, password)
            .then(res => {
                storeUserData(res.user, res.token);
                this.setState({
                    user: res.user,
                    isLoading: false,
                });
                const to = res.user.isAdmin ? '/elections/' : '/';
                this.props.history.push(to);

            })
            .catch(err => {
                this.setState({isLoading: false, error: err.response.data}
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
            .then(() => {
                deleteUserData();
                this.setState({isLoading: false, error: null});
                this.props.history.replace('/login/')
            })
            .catch(err => {
                if (err.status == 401) {
                    deleteUserData();
                    this.props.history.replace('/login/')
                } else {
                    err.json()
                        .then(res => {
                                this.setState({isLoading: false, error: res.detail})
                            }
                        )
                }
            })
    };

    onSnackbarClose = () => {
        this.setState({error: null})
    };

    constructor(props) {
        super(props);
        let user = null;
        try {
            user = getUserData();
        } catch (e) {
            deleteUserData();
        }
        this.state = {
            user: user,
            error: null,
            isLoading: false,

            login: this.login,
            logout: this.logout,
        }
    }

    render() {
        const {error} = this.state;
        return (
            <div>
                <Provider value={this.state}>
                    {this.props.children}
                </Provider>
                <Snackbar open={!!error} message={<span>{error}</span>} autoHideDuration={5000}
                          onClose={this.onSnackbarClose}/>
            </div>
        );
    }
}

export const AuthProvider = withRouter((AuthProviderComponent));
