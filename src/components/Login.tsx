import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Paper from "@material-ui/core/Paper/Paper";
import {style} from "typestyle";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import {RouteComponentProps} from 'react-router-dom';
import {Responsive} from "../modules/layout/components/Responsive";

export interface LoginProps extends RouteComponentProps {
    handleLogin,
}

export interface LoginState {
    code: string,
}

const styles = {
    paper: style({
        padding: 30,
        marginTop: 20,
    })
};

export class Login extends React.Component<LoginProps, LoginState> {

    handleLogin() {
        console.log(this.state);
        this.props.handleLogin()
    }

    render() {
        return (
            <Responsive edgeSize={4}>
                <Paper className={styles.paper}>
                    <Grid container direction={"column"} alignItems={"center"} justify={"center"}>
                        <Grid>
                            <Typography variant={"h2"} align={"center"}>Login</Typography>
                        </Grid>
                        <Grid>
                            <TextField
                                id="code"
                                label="Dein Code"
                                margin="normal"
                                variant={"outlined"}
                                onChange={(event) => this.setState({code: event.target.value})}
                            />
                        </Grid>
                        <Grid>
                            <Button variant={"outlined"} onClick={() => this.handleLogin()}> Login</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Responsive>
        );
    }
}