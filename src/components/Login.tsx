import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Paper from "@material-ui/core/Paper/Paper";
import {style} from "typestyle";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import { RouteComponentProps } from 'react-router-dom';

export interface LoginProps extends RouteComponentProps{
    handleLogin,
}

export interface LoginState {
    code: string,
}

const styles = {
    paper: style({
        width: "100%",
        padding: 10,
        marginTop: 20,
    })
};

export class Login extends React.Component<LoginProps, LoginState> {

    handleLogin(){
        console.log(this.state)
        this.props.handleLogin()
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Hidden smDown>
                        <Grid item xs={4}/>
                    </Hidden>
                    <Grid item xs>
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
                                        onChange={(event) => this.setState({code: event.target.value})}
                                    />
                                </Grid>
                                <Grid>
                                    <Button variant={"outlined"} onClick={()=> this.handleLogin()}> Login</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Hidden smDown>
                        <Grid item xs={4}/>
                    </Hidden>
                </Grid>
            </div>
        );
    }
}