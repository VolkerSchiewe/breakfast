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
    saveSubElection(name: string)
}

const styles = {
    paper: style({
        padding: 15,
    }),
    button: style({
        margin: 5,
    }),
};

export class CreateSubElection extends React.Component<CreateElectionProps, CreateElectionState> {

    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    submit = (e) => {
        e.preventDefault();
        const {name} = this.state;
        this.props.saveSubElection(name);
        this.setState({name: ''});
    };

    handleNameChange = (newValue) => {
        this.setState({name: newValue})
    };

    render() {
        const {name} = this.state;
        return (
            <form onSubmit={this.submit}>
                <Paper className={styles.paper}>
                    <Typography variant={"h6"}>
                        Wahl hinzufügen
                    </Typography>
                    <Grid container>
                        <TextField variant={"outlined"}
                                   label={"Titel"}
                                   value={name}
                                   required
                                   onChange={(e) => this.handleNameChange(e.target.value)}/>
                        <Button className={styles.button} type="submit">Speichern</Button>
                    </Grid>
                </Paper>
            </form>
        )
    }
}
