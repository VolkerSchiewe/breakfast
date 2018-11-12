import * as React from "react";
import {Election} from "../interfaces/Election";
import {style} from "typestyle";
import {SubElection} from "../interfaces/SubElection";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import {CandidateView} from "./CandidateView";
import {Add, Delete, Edit, Refresh} from "@material-ui/icons";
import {ResultView} from "./ResultView";
import cc from "classcat"
import {CreateSubElection} from "./CreateSubElection";
import {Candidate} from "../interfaces/Candidate";
import Button from "@material-ui/core/Button/Button";

interface ElectionListProps {
    election: Election
    subElections: SubElection[]

    deleteElection(electionId)

    openCandidateModal(subElectionId: number, candidate?: Candidate)

    saveSubElection(name: string)

    editSubElection(subElection: SubElection)

    refreshData()
}

const styles = ({
    root: style({
        marginTop: 20,
        maxWidth: 1000,
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
    header: style({
        display: "flex",
        justifyContent: "space-between",
    }),
    votes: style({
        marginLeft: 5,
    }),
});

export const EditElection = ({election, subElections, openCandidateModal, saveSubElection, editSubElection, deleteElection, refreshData}: ElectionListProps) => (
    <Grid container justify={"center"}>
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography variant={"h3"} gutterBottom>
                    {election.title}
                </Typography>
                <div>
                    {!election.isActive ?
                        <Button onClick={deleteElection}><Delete/></Button>
                        :
                        <Typography variant={"h6"}>Aktiv</Typography>
                    }
                    <Button onClick={refreshData}><Refresh/></Button>
                </div>
            </div>
            {election.voteCount > 0 && subElections.length > 0 &&
            <Typography variant={"h6"}
                        className={styles.votes}>{subElections[0].candidates.map(c => c.votes).reduce((ac, v) => ac + v)}{" Stimmen"}</Typography>
            }
            <Grid container>
                {subElections.map(subElection => (
                    <Grid item xs={6} className={styles.grid} key={subElection.id}>
                        <Paper className={styles.paper}>
                            <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
                                <Typography variant={"h4"} align={"center"}>
                                    {subElection.title}
                                </Typography>
                                {!subElection.candidates.some(c => c.name == 'Enthaltung') &&
                                <Typography color={"error"}>Enthaltung fehlt.</Typography>
                                }
                                {!election.isActive &&
                                <Button onClick={() => editSubElection(subElection)}>
                                    <Edit/>
                                </Button>
                                }
                            </Grid>
                            <Grid container>
                                {subElection.candidates.map(candidate => (
                                        <Grid className={styles.candidate}
                                              onClick={() => {
                                                  if (!election.isActive) openCandidateModal(subElection.id, candidate)
                                              }}
                                              key={candidate.id}>
                                            <CandidateView candidate={candidate}/>
                                        </Grid>
                                    )
                                )}
                                {!election.isActive &&
                                <Grid className={cc([styles.addCandidate, styles.candidate])}
                                      onClick={() => openCandidateModal(subElection.id)}>
                                    <Add fontSize={"large"}/>
                                    <Typography align={"center"}>Neu</Typography>
                                </Grid>
                                }
                            </Grid>
                            <ResultView className={styles.results} subElection={subElection}/>
                        </Paper>
                    </Grid>
                ))}
                {!election.isActive &&
                <Grid item xs={6} className={styles.grid}>
                    <CreateSubElection saveSubElection={saveSubElection}/>
                </Grid>
                }
            </Grid>
        </div>
    </Grid>
);