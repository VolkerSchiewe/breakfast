import * as React from "react";
import Typography from "@mui/material/Typography/Typography";
import Grid from "@mui/material/Grid/Grid";
import TextField from "@mui/material/TextField/TextField";
import Button from "@mui/material/Button/Button";
import Paper from "@mui/material/Paper/Paper";
import { style } from "typestyle";

interface CreateElectionState {
  name: string;
}

interface CreateElectionProps {
  saveSubElection: (name: string) => any;
}

const styles = {
  paper: style({
    padding: 15,
  }),
  button: style({
    margin: 5,
  }),
};

export class CreateSubElection extends React.Component<
  CreateElectionProps,
  CreateElectionState
> {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  submit = (e: React.FormEvent): void => {
    e.preventDefault();
    const { name } = this.state;
    this.props.saveSubElection(name);
    this.setState({ name: "" });
  };

  handleNameChange = (newValue: string): void => {
    this.setState({ name: newValue });
  };

  render(): React.ReactElement {
    const { name } = this.state;
    return (
      <form onSubmit={this.submit}>
        <Paper className={styles.paper}>
          <Typography variant={"h6"}>Wahl hinzufügen</Typography>
          <Grid container>
            <TextField
              variant={"outlined"}
              label={"Titel"}
              value={name}
              required
              onChange={(e) => this.handleNameChange(e.target.value)}
            />
            <Button className={styles.button} type="submit">
              Speichern
            </Button>
          </Grid>
        </Paper>
      </form>
    );
  }
}
