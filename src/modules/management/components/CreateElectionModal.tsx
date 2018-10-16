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
    titleError: boolean
    numberError: boolean
}

export class CreateElectionModal extends React.Component<CreateElectionModalProps, CreateElectionModalState> {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            titleError: false,
            numberError: false,
        }
    }

    handleTitleChange = (value) => {
        this.setState({title: value})
    };

    handleNumberChange = (value) => {
        this.setState({number: value})
    };

    submit = () => {
        const {title, number} = this.state;
        let titleError = title === '';
        let numberError = number === 0 || number == undefined || number === '';

        if (!titleError && !numberError)
            this.props.saveElection(title, number);
        else
            this.setState({
                titleError: titleError,
                numberError: numberError
            })
    };

    render() {
        const {isOpen, handleClose} = this.props;
        const {title, number, titleError, numberError} = this.state;
        return (
            <div>
                <Dialog open={isOpen}>
                    <DialogTitle>Wahl erstellen</DialogTitle>
                    <DialogContent>
                        <Grid container direction={"column"} justify={"center"}>
                            <TextField
                                variant={"outlined"}
                                onChange={(e) => this.handleTitleChange(e.target.value)}
                                value={title}
                                error={titleError}
                                autoFocus
                                required
                                label="Wahl Titel"
                                margin={"normal"}/>
                            <TextField
                                variant={"outlined"}
                                onChange={(e) => this.handleNumberChange(e.target.value)}
                                value={number}
                                error={numberError}
                                label="Wahlberechtigte"
                                type="number"
                                margin={"normal"}/>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="default">
                            Abbrechen
                        </Button>
                        <Button onClick={this.submit} color="primary">
                            Speichern
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
