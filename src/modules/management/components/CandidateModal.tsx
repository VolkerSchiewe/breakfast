import * as React from "react";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import {UploadImage} from "../../misc/components/UploadImage";
import {Candidate} from "../interfaces/Candidate";

interface CandidateModalProps {
    isOpen: boolean;
    imagePreview,
    candidate: Candidate,

    handleClose;
    saveCandidate;
    handleNameChange;
    handleImageChange;
    handleClearImage;
}

export const CandidateModal = ({isOpen, imagePreview, candidate, handleClose, saveCandidate, handleNameChange, handleImageChange, handleClearImage}: CandidateModalProps) => (
    <div>
        <Dialog open={isOpen}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Kandidat hinzufügen</DialogTitle>
            <DialogContent>
                <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                    <UploadImage imagePreview={imagePreview}
                                 handleImageChange={handleImageChange}
                                 handleClearImage={handleClearImage}/>
                    <TextField
                        onChange={(e) => handleNameChange(e.target.value)}
                        value={candidate.name}
                        autoFocus
                        margin="dense"
                        label="Name"
                        variant={"outlined"}/>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">
                    Abbrechen
                </Button>
                <Button onClick={saveCandidate} color="primary">
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);
