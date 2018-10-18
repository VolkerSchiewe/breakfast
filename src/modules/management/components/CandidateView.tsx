import * as React from "react";
import Avatar from "@material-ui/core/Avatar/Avatar";
import {Candidate} from "../interfaces/Candidate";
import Typography from "@material-ui/core/Typography/Typography";
import {style} from "typestyle";
import {defaultImage} from "../../misc/components/UploadImage";

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
        <Avatar src={candidate.image && candidate.image.base64Image || defaultImage}/>
        <Typography align={"center"}>{candidate.name}</Typography>
    </div>
);
