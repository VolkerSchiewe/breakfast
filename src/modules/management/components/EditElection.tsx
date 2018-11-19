import * as React from "react";
import {Election} from "../interfaces/Election";
import {style} from "typestyle";
import {SubElection} from "../interfaces/SubElection";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import {CandidateView} from "./CandidateView";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Refresh from "@material-ui/icons/Refresh";
import {ResultView} from "./ResultView";
import cc from "classcat"
import {CreateSubElection} from "./CreateSubElection";
import {Candidate} from "../interfaces/Candidate";
import Button from "@material-ui/core/Button/Button";
import {ElectionState} from "../interfaces/ElectionState";
import {MoreMenu} from "../../layout/components/MoreMenu";
import {StatusBadge} from "../../layout/components/StatusBadge";
import Lock from "@material-ui/icons/Lock";

interface ElectionListProps {
    election: Election
    subElections: SubElection[]

    openCandidateModal(subElectionId: number, candidate?: Candidate)

    saveSubElection(name: string)

    editSubElection(subElection: SubElection)

    handleMenuItemSelected(item: number)

    handleResultClick(subElection: SubElection)

    editElection()

}

const styles = ({
    root: style({
        maxWidth: 1000,
        margin: '80px auto',
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    }),
    results: style({
        marginTop: 20,
    }),
    header: style({
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 10,
    }),
    votes: style({
        marginLeft: 5,
    }),
    headerItems: style({
        display: 'flex',
        flexDirection: 'row',
    }),
});
const options = [
    {
        id: 0,
        text: "Refresh",
        icon: <Refresh/>
    }, {
        id: 1,
        text: "Abschließen",
        icon: <Lock/>
    }
];


export const EditElection = ({election, subElections, openCandidateModal, saveSubElection, editSubElection, editElection, handleMenuItemSelected, handleResultClick}: ElectionListProps) => (
    <div className={styles.root}>
        <Grid container>
            <Grid item xs={12} className={styles.header}>
                <div className={styles.headerItems}>
                    <Typography variant={"h3"}>
                        {election.title}
                    </Typography>
                    {election.state == ElectionState.NOT_ACTIVE &&
                    <Button onClick={editElection}>
                        <Edit/>
                    </Button>
                    }
                </div>

                <div className={styles.headerItems}>
                    <StatusBadge state={election.state}/>

                    {election.state != ElectionState.CLOSED &&
                    <MoreMenu options={options} onItemSelected={handleMenuItemSelected}/>
                    }
                </div>
            </Grid>
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
                                {election.state == ElectionState.NOT_ACTIVE &&
                                <Button onClick={() => editSubElection(subElection)}>
                                    <Edit/>
                                </Button>
                                }
                            </Grid>
                            <Grid container>
                                {subElection.candidates.map(candidate => (
                                        <Grid className={styles.candidate}
                                              onClick={() => {
                                                  if (election.state == ElectionState.NOT_ACTIVE) openCandidateModal(subElection.id, candidate)
                                              }}
                                              key={candidate.id}>
                                            <CandidateView candidate={candidate}/>
                                        </Grid>
                                    )
                                )}
                                {election.state == ElectionState.NOT_ACTIVE &&
                                <Grid className={cc([styles.addCandidate, styles.candidate])}
                                      onClick={() => openCandidateModal(subElection.id)}>
                                    <Add fontSize={"large"}/>
                                    <Typography align={"center"}>Neu</Typography>
                                </Grid>
                                }
                            </Grid>
                            <ResultView className={styles.results} subElection={subElection}
                                        onClick={handleResultClick}/>
                        </Paper>
                    </Grid>
                ))}
                {election.state == ElectionState.NOT_ACTIVE &&
                <Grid item xs={6} className={styles.grid}>
                    <CreateSubElection saveSubElection={saveSubElection}/>
                </Grid>
                }
            </Grid>
        </Grid>
    </div>
);