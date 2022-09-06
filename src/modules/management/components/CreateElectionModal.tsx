import * as React from "react";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import TextField from "@mui/material/TextField/TextField";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import Button from "@mui/material/Button/Button";
import Grid from "@mui/material/Grid/Grid";

interface CreateElectionModalProps {
  isOpen: boolean;

  handleClose: () => any;

  saveElection: (title: string, number: number) => void;
}

interface CreateElectionModalState {
  title: string;
  number?: number;
}

export class CreateElectionModal extends React.Component<
  CreateElectionModalProps,
  CreateElectionModalState
> {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      number: undefined,
    };
  }

  handleTitleChange = (value: string): void => {
    this.setState({ title: value });
  };

  handleNumberChange = (value: number): void => {
    this.setState({ number: value });
  };

  submit = (e: React.FormEvent): void => {
    e.preventDefault();
    const { title, number } = this.state;
    this.props.saveElection(title, number as number);
  };

  render(): React.ReactElement {
    const { isOpen, handleClose } = this.props;
    const { title, number } = this.state;
    return (
      <div>
        <Dialog open={isOpen}>
          <form onSubmit={this.submit}>
            <DialogTitle>Wahlgang erstellen</DialogTitle>
            <DialogContent>
              <Grid container direction={"column"} justifyContent={"center"}>
                <TextField
                  variant={"outlined"}
                  onChange={(e) => this.handleTitleChange(e.target.value)}
                  value={title}
                  autoFocus
                  required
                  label="Name"
                  margin={"normal"}
                />
                <TextField
                  variant={"outlined"}
                  onChange={(e) =>
                    this.handleNumberChange(parseInt(e.target.value))
                  }
                  value={number}
                  label="Wahlberechtigte"
                  type="number"
                  required
                  margin={"normal"}
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Abbrechen</Button>
              <Button type="submit" color="primary">
                Speichern
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}
