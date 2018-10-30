import * as React from "react";
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import {CandidateView} from "../../management/components/CandidateView";
import Button from "@material-ui/core/Button/Button";
import {SubElection} from "../../management/interfaces/SubElection";
import {style} from "typestyle";
import {theme} from "../../layout/styles/styles";
import {Candidate} from "../../management/interfaces/Candidate";

interface ElectionProps {
    subElections: SubElection []
    selectedCandidates: {}

    onCandidateClick(subElection: SubElection, candidate: Candidate)

    onSubmit()

    onReload()
}

const styles = {
    root: style({
        width: "95%",
    }),
    placeholder: style({
        height: "90vh",
    }),
    header: style({
        fontSize: "10vw",
        marginTop: 10,
    }),
    subElection: style({
        ...theme.mixins.gutters(),
        marginTop: 20,
        marginBottom: 20,
        padding: 20,
    }),
    subElectionTitle: style({
        marginBottom: 10,
    }),
    submitButton: style({
        position: "fixed",
        bottom: 0,
        width: "100%"
    })
};

export const Election = ({subElections, selectedCandidates, onCandidateClick, onSubmit, onReload}: ElectionProps) => (
    <div>
        {subElections.length == 0 ?
            <Grid container justify={"center"} alignItems={"center"} className={styles.placeholder}
                  direction={"column"}>
                <Typography variant={"h5"} align={"center"}>{"Es geht noch nicht los!"}</Typography>
                <Button variant={"outlined"} onClick={onReload}>Nochmal versuchen</Button>
            </Grid>
            :
            <Grid container alignItems={"center"} direction={"column"}>
                <div className={styles.root}>
                    <Typography variant={"h3"} align={"center"}
                                className={styles.header}>{"Kandidaten wählen:"}</Typography>
                    {subElections.map(subElection => (
                            <Paper key={subElection.id} className={styles.subElection}>
                                <Typography className={styles.subElectionTitle} variant={"h3"} align={"center"}>
                                    {subElection.title}
                                </Typography>
                                <Grid container direction={"row"} justify={"space-evenly"}>
                                    {subElection.candidates.map(candidate => (
                                            <div key={candidate.id}>
                                                <CandidateView isSelectable candidate={candidate}
                                                               isSelected={candidate.id == selectedCandidates[subElection.id]}
                                                               onClick={(e) => onCandidateClick(subElection, candidate)}/>
                                            </div>
                                        )
                                    )}
                                </Grid>
                            </Paper>
                        )
                    )}
                </div>
                <Button className={styles.submitButton} variant={"contained"} color={"primary"} onClick={onSubmit}>
                    {"Stimme abgeben"}
                </Button>
            </Grid>
        }
    </div>
);
