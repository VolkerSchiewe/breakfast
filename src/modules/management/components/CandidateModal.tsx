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
import Delete from "@material-ui/icons/Delete";

interface CandidateModalProps {
    isOpen: boolean
    candidate: Candidate
    isNew: boolean

    handleClose()

    handleDelete(candidate)

    saveCandidate(candidate)
}

interface CandidateModalState {
    candidate: Candidate
}

export class CandidateModal extends React.Component<CandidateModalProps, CandidateModalState> {

    constructor(props) {
        super(props);
        this.state = {
            candidate: props.candidate,
        };
    }

    handleNameChange = (value) => {
        const {candidate} = this.state;
        let image = null;
        if (candidate.image !== null && candidate.image !== undefined) {
            image = {
                ...candidate.image,
                name: value,
            };
        }
        this.setState({
            candidate: {
                ...candidate,
                name: value,
                image: image,
            }
        })
    };

    handleClearImage = (event) => {
        event.stopPropagation();
        this.setState({
            candidate: {
                ...this.state.candidate,
                image: null,
            }
        });
    };

    handleImageChange = (files) => {
        if (files.length !== 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    candidate: {
                        ...this.state.candidate,
                        image: {
                            name: this.state.candidate.name,
                            base64Image: reader.result,
                        }
                    },
                });
            };
            reader.readAsDataURL(files[0]);
        }
    };

    submit = (e) => {
        e.preventDefault();
        this.props.saveCandidate(this.state.candidate);
    };

    render() {
        const {isOpen, isNew, handleClose, handleDelete} = this.props;
        const {candidate} = this.state;
        return (
            <div>
                <Dialog open={isOpen}
                        onClose={handleClose}
                        aria-labelledby="form-dialog-title">
                    <form onSubmit={this.submit}>
                        <DialogTitle id="form-dialog-title">Kandidat hinzufügen</DialogTitle>
                        <DialogContent>
                            <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                                <UploadImage
                                    imagePreview={candidate.image && candidate.image.base64Image || defaultImage}
                                    handleImageChange={this.handleImageChange}
                                    handleClearImage={this.handleClearImage}/>
                                <TextField
                                    onChange={(e) => this.handleNameChange(e.target.value)}
                                    value={candidate.name}
                                    autoFocus
                                    required
                                    margin="dense"
                                    label="Name"
                                    variant={"outlined"}/>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            {!isNew &&
                            <Button onClick={() => handleDelete(candidate)}>
                                <Delete/>
                            </Button>
                            }
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
