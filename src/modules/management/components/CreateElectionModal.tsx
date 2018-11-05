import * as React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid/Grid";

interface CreateElectionModalProps {
    isOpen: boolean

    handleClose()

    saveElection(title, number)
}

interface CreateElectionModalState {
    title?: string
    number?: number | string
}

export class CreateElectionModal extends React.Component<CreateElectionModalProps, CreateElectionModalState> {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            number: '',
        }
    }

    handleTitleChange = (value) => {
        this.setState({title: value})
    };

    handleNumberChange = (value) => {
        this.setState({number: value})
    };

    submit = (e) => {
        e.preventDefault();
        const {title, number} = this.state;
        this.props.saveElection(title, number);
    };

    render() {
        const {isOpen, handleClose} = this.props;
        const {title, number} = this.state;
        return (
            <div>
                <Dialog open={isOpen}>
                    <form onSubmit={this.submit}>
                        <DialogTitle>Wahl erstellen</DialogTitle>
                        <DialogContent>
                            <Grid container direction={"column"} justify={"center"}>
                                <TextField
                                    variant={"outlined"}
                                    onChange={(e) => this.handleTitleChange(e.target.value)}
                                    value={title}
                                    autoFocus
                                    required
                                    label="Wahl Titel"
                                    margin={"normal"}/>
                                <TextField
                                    variant={"outlined"}
                                    onChange={(e) => this.handleNumberChange(e.target.value)}
                                    value={number}
                                    label="Wahlberechtigte"
                                    type="number"
                                    required
                                    margin={"normal"}/>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="default">
                                Abbrechen
                            </Button>
                            <Button type="submit" color="primary">
                                Speichern
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        )
    }
}
