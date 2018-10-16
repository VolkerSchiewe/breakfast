import * as React from 'react';
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";
import {style} from "typestyle";

interface CreateElectionState {
    name?: string
    nameError: boolean
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
    handleNewElection = () => {
        const {name} = this.state;
        if (name !== '' && name !== undefined) {
            this.setState({name: '', nameError: false});
            console.log(name)
            //TODO send to backend
        } else
            this.setState({nameError: true})
    };

    handleNameChange = (newValue) => {
        this.setState({name: newValue})
    };

    constructor(props) {
        super(props);
        this.state = {
            nameError: false,
            name: ''
        }
    }

    render() {
        const {name, nameError} = this.state;
        return (
            <Paper className={styles.paper}>
                <Typography variant={"h6"}>
                    Wahl hinzufügen
                </Typography>
                <Grid container>
                    <TextField variant={"outlined"}
                               label={"Titel"}
                               value={name}
                               error={nameError}
                               onChange={(e) => this.handleNameChange(e.target.value)}/>
                    <Button className={styles.button} onClick={this.handleNewElection}>Speichern</Button>
                </Grid>
            </Paper>
        )
    }
}
