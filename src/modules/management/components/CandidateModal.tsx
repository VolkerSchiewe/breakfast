import * as React from "react";
import TextField from "@mui/material/TextField/TextField";
import Grid from "@mui/material/Grid/Grid";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import Button from "@mui/material/Button/Button";
import { defaultImage, UploadImage } from "../../misc/components/UploadImage";
import { Candidate } from "../interfaces/Candidate";
import Delete from "@mui/icons-material/Delete";

interface CandidateModalProps {
  isOpen: boolean;
  candidate: Partial<Candidate>;
  isNew: boolean;

  handleClose: () => any;

  handleDelete: (candidate) => any;

  saveCandidate: (candidate) => any;
}

interface CandidateModalState {
  candidate: Candidate;
}

export class CandidateModal extends React.Component<
  CandidateModalProps,
  CandidateModalState
> {
  constructor(props) {
    super(props);
    this.state = {
      candidate: props.candidate,
    };
  }

  handleNameChange = (value: string): void => {
    const { candidate } = this.state;
    let image: any = null;
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
        image,
      },
    });
  };

  handleClearImage = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    this.setState({
      candidate: {
        ...this.state.candidate,
        image: undefined,
      },
    });
  };

  handleImageChange = (files: File[]): void => {
    if (files.length !== 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          candidate: {
            ...this.state.candidate,
            image: {
              name: this.state.candidate.name,
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              base64Image: reader.result?.toString() ?? "",
            },
          },
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  submit = (e: React.FormEvent): void => {
    e.preventDefault();
    this.props.saveCandidate(this.state.candidate);
  };

  render(): React.ReactElement {
    const { isOpen, isNew, handleClose, handleDelete } = this.props;
    const { candidate } = this.state;
    return (
      <div>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={this.submit}>
            <DialogTitle id="form-dialog-title">
              Kandidat hinzufügen
            </DialogTitle>
            <DialogContent>
              <Grid
                container
                direction={"column"}
                justifyContent={"space-around"}
                alignItems={"center"}
              >
                <UploadImage
                  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                  imagePreview={candidate.image?.base64Image ?? defaultImage}
                  handleImageChange={this.handleImageChange}
                  handleClearImage={this.handleClearImage}
                />
                <TextField
                  onChange={(e) => this.handleNameChange(e.target.value)}
                  value={candidate.name}
                  autoFocus
                  required
                  margin="dense"
                  label="Name"
                  variant={"outlined"}
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              {!isNew && (
                <Button onClick={() => handleDelete(candidate)}>
                  <Delete />
                </Button>
              )}
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
