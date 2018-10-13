import * as React from "react";
import Avatar from "@material-ui/core/Avatar/Avatar";
import {Candidate} from "../interfaces/Candidate";
import Typography from "@material-ui/core/Typography/Typography";
import {style} from "typestyle";

interface CandidateViewProps {
    candidate: Candidate,
}

const styles = {
    root: style({
        maxWidth: "min-content",
    }),
};

export const CandidateView = ({candidate}: CandidateViewProps) => (
    <div className={styles.root}>
        <Avatar src={candidate.imageFile}/>
        <Typography align={"center"}>{candidate.name}</Typography>
    </div>
);
