import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import {style} from "typestyle";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import {AuthConsumer} from "../modules/auth/components/AuthContext";
import {AuthInterface} from "../modules/auth/interfaces/AuthInterface";
import {LoadingSpinner} from "../modules/misc/components/LoadingSpinner";

interface LoginProps {
}

interface LoginState {
    username: string
    password: string
    showAdminLogin: boolean
    isLoading: boolean
}

const styles = {
    paper: style({
        padding: 50,
        paddingRight: 80,
        paddingLeft: 80,
        marginTop: 20,
    }),
    button: style({
        marginTop: 15,
    }),
};

export class Login extends React.Component<LoginProps, LoginState> {
    toggleAdminView = () => {
        const {showAdminLogin} = this.state;
        this.setState({showAdminLogin: !showAdminLogin})
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showAdminLogin: false,
            isLoading: false,
        }
    }

    render() {
        const {username, password, showAdminLogin} = this.state;
        const userLabel = showAdminLogin ? 'Name' : 'Dein Code';
        const pwd = showAdminLogin ? password : 'ebujugend';
        return (
            <AuthConsumer>
                {({login, error, isLoading}: AuthInterface) => (
                    <Grid container alignItems={"center"} direction={"column"}>
                        <Paper className={styles.paper}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                login(username, pwd)
                            }}>
                                <Grid container direction={"column"} alignItems={"center"} justify={"center"}>
                                    <Grid>
                                        <Typography variant={"h2"} align={"center"}>Login</Typography>
                                    </Grid>
                                    <Grid>
                                        <TextField
                                            required
                                            value={username}
                                            error={error != null}
                                            label={userLabel}
                                            variant={"outlined"}
                                            margin={"dense"}
                                            onChange={(event) => this.setState({username: event.target.value})}
                                        />
                                    </Grid>
                                    {showAdminLogin &&
                                    <Grid>
                                        <TextField
                                            required
                                            value={password}
                                            error={error != null}
                                            type={"password"}
                                            label="Password"
                                            margin={"dense"}
                                            variant={"outlined"}
                                            onChange={(event) => this.setState({password: event.target.value})}
                                        />
                                    </Grid>
                                    }
                                    <Button className={styles.button} variant={"outlined"} type="submit"
                                            fullWidth>Login
                                    </Button>
                                    <LoadingSpinner marginTop={20} size={20} isLoading={isLoading}/>
                                </Grid>
                            </form>
                        </Paper>
                        <Typography onClick={this.toggleAdminView}>Admin</Typography>
                    </Grid>
                )}
            </AuthConsumer>
        );
    }
}
