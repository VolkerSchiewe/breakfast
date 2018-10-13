import * as React from "react";
import {Election} from "../interfaces/Election";
import {style} from "typestyle";
import {theme} from "../../layout/styles/styles";
import {Link} from "react-router-dom";
import {SubElection} from "../interfaces/SubElection";
import {Responsive} from "../../layout/components/Responsive";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import {CandidateView} from "./CandidateView";
import {Add} from "@material-ui/icons";
import {ResultView} from "./ResultView";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import {Candidate} from "../interfaces/Candidate";
import cc from "classcat"
import {CandidateModal} from "./CandidateModal";

interface ElectionListProps {
    election: Election,
    subElections: SubElection[],
    modalCandidate: Candidate,
    modalImagePreview,
    candidateModalOpen: boolean,

    handleCandidateClick,
    handleNewCandidateClick,
    handleCandidateModalClose,
    saveCandidate,
    handleModalNameChange,
    handleModalImageChange,
    handleModalClearImage,
}

const styles = ({
    root: style({
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    }),
    paper: style({
        padding: 15,
    }),
    grid: style({
        padding: 5,
    }),
    candidate: style({
        margin: 10,
        cursor: "pointer",

    }),
    addCandidate: style({
        maxWidth: "min-content",
    }),
    results: style({
        marginTop: 20,
    }),
    button: style({
        margin: 5
    }),
});

export const EditElection = ({election, subElections, modalCandidate, modalImagePreview, candidateModalOpen, handleCandidateClick, handleNewCandidateClick, handleCandidateModalClose, saveCandidate, handleModalNameChange, handleModalImageChange, handleModalClearImage,}: ElectionListProps) => (
    <div>
        <Responsive edgeSize={2}>
            <Typography variant="h3" gutterBottom>
                {election.name}
            </Typography>
            <Grid container>
                {subElections.map(subElection => (
                    <Grid item xs={6} className={styles.grid}>
                        <Paper className={styles.paper}>
                            <Typography variant={"h4"} align={"center"}>
                                {subElection.name}
                            </Typography>
                            <Grid container>
                                {subElection.candidates.map(candidate => (
                                    <Grid className={styles.candidate} onClick={() => handleCandidateClick(candidate)}>
                                        <CandidateView candidate={candidate}/>
                                    </Grid>
                                ))
                                }
                                <Grid className={cc([styles.addCandidate, styles.candidate])}
                                      onClick={handleNewCandidateClick}>
                                    <Add fontSize={"large"}/>
                                    <Typography align={"center"}>Neu</Typography>
                                </Grid>
                                <CandidateModal isOpen={candidateModalOpen}
                                                candidate={modalCandidate}
                                                imagePreview={modalImagePreview}

                                                handleClose={handleCandidateModalClose}
                                                saveCandidate={saveCandidate}
                                                handleNameChange={handleModalNameChange}
                                                handleImageChange={handleModalImageChange}
                                                handleClearImage={handleModalClearImage}
                                />

                            </Grid>
                            <ResultView className={styles.results} subElection={subElection}/>
                        </Paper>
                    </Grid>
                ))}
                <Grid item xs={6} className={styles.grid}>
                    <Paper className={styles.paper}>
                        <Typography variant={"h6"}>
                            Wahl hinzufügen
                        </Typography>
                        <Grid container>
                            <TextField variant={"outlined"} label={"Titel"}/>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="checkedB"
                                        color="primary"
                                    />
                                }
                                label="Multiselect"
                            />
                            <Grid container justify={"flex-end"}>
                                <Button className={styles.button}>Speichern</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Responsive>
    </div>
);