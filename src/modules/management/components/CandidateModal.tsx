import * as React from "react";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import {defaultImage, UploadImage} from "../../misc/components/UploadImage";
import {Candidate} from "../interfaces/Candidate";

interface CandidateModalProps {
    isOpen: boolean
    candidate: Candidate

    handleClose()

    saveCandidate(candidate)
}

interface CandidateModalState {
    candidate: Candidate
    nameError: boolean
    imagePreview: string | ArrayBuffer
}

export class CandidateModal extends React.Component<CandidateModalProps, CandidateModalState> {
    handleClearImage = (event) => {
        event.stopPropagation();
        this.setState({
            imagePreview: defaultImage,
            candidate: {
                name: this.state.candidate.name,
                imageFile: null
            }
        });
    };
    handleImageChange = (files) => {
        if (files.length !== 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    candidate: {
                        name: this.state.candidate.name,
                        imageFile: files[0]
                    },
                    imagePreview: reader.result,
                });
            };
            reader.readAsDataURL(files[0]);
        }
    };
    handleNameChange = (value) => {
        this.setState({
            candidate: {
                name: value,
            }
        })
    };
    submit = () => {
        const {candidate} = this.state;
        if (candidate.name !== '')
            this.props.saveCandidate(candidate);
        else
            this.setState({nameError: true});
    };

    constructor(props) {
        super(props);
        this.state = {
            candidate: props.candidate,
            nameError: false,
            imagePreview: props.candidate.imageFile || defaultImage,
        }
    }

    render() {
        const {isOpen, handleClose} = this.props;
        const {imagePreview, candidate, nameError} = this.state;
        return (
            <div>
                <Dialog open={isOpen}
                        onClose={handleClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Kandidat hinzufügen</DialogTitle>
                    <DialogContent>
                        <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                            <UploadImage imagePreview={imagePreview}
                                         handleImageChange={this.handleImageChange}
                                         handleClearImage={this.handleClearImage}/>
                            <TextField
                                onChange={(e) => this.handleNameChange(e.target.value)}
                                value={candidate.name}
                                error={nameError}
                                autoFocus
                                required
                                margin="dense"
                                label="Name"
                                variant={"outlined"}/>
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
