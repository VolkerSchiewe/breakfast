import * as React from 'react';
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";
import {style} from "typestyle";

interface CreateElectionState {
    name?: string
}

interface CreateElectionProps {

}

const styles = {
    paper: style({
        padding: 15,
    }),
    button: style({
        margin: 5,
    }),
};

export class CreateElection extends React.Component<CreateElectionProps, CreateElectionState> {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleNameChange = (newValue) => {
        this.setState({name: newValue})
    };

    handleNewElection = () => {
        // TODO send to backend
    };

    render() {
        return (
            <Paper className={styles.paper}>
                <Typography variant={"h6"}>
                    Wahl hinzufügen
                </Typography>
                <Grid container>
                    <TextField variant={"outlined"} label={"Titel"} value={this.state.name}
                               onChange={(e) => this.handleNameChange(e.target.value)}/>
                    <Button className={styles.button} onClick={this.handleNewElection}>Speichern</Button>
                </Grid>
            </Paper>
        )
    }
}
