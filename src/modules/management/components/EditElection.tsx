import * as React from "react";
import {Election} from "../interfaces/Election";
import {style} from "typestyle";
import {theme} from "../../layout/styles/styles";
import {SubElection} from "../interfaces/SubElection";
import {Responsive} from "../../layout/components/Responsive";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import {CandidateView} from "./CandidateView";
import {Add} from "@material-ui/icons";
import {ResultView} from "./ResultView";
import cc from "classcat"
import {CreateElection} from "./CreateElection";
import {Candidate} from "../interfaces/Candidate";

interface ElectionListProps {
    election: Election
    subElections: SubElection[]

    openCandidateModal(subElectionId: number, candidate?: Candidate)

    saveSubElection(name: string)
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
});

export const EditElection = ({election, subElections, openCandidateModal, saveSubElection}: ElectionListProps) => (
    <div>
        <Responsive edgeSize={2}>
            <Typography variant="h3" gutterBottom>
                {election.title}
            </Typography>
            <Grid container>
                {subElections.map(subElection => (
                    <Grid item xs={6} className={styles.grid} key={subElection.id}>
                        <Paper className={styles.paper}>
                            <Typography variant={"h4"} align={"center"}>
                                {subElection.title}
                            </Typography>
                            <Grid container>
                                {subElection.candidates.map(candidate => (
                                    <Grid className={styles.candidate}
                                          onClick={() => openCandidateModal(subElection.id, candidate)}
                                          key={candidate.id}>
                                        <CandidateView candidate={candidate}/>
                                    </Grid>
                                ))
                                }
                                <Grid className={cc([styles.addCandidate, styles.candidate])}
                                      onClick={() => openCandidateModal(subElection.id)}>
                                    <Add fontSize={"large"}/>
                                    <Typography align={"center"}>Neu</Typography>
                                </Grid>
                            </Grid>
                            <ResultView className={styles.results} subElection={subElection}/>
                        </Paper>
                    </Grid>
                ))}
                <Grid item xs={6} className={styles.grid}>
                    <CreateElection saveSubElection={saveSubElection}/>
                </Grid>
            </Grid>
        </Responsive>
    </div>
);