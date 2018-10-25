import * as React from "react";
import Avatar from "@material-ui/core/Avatar/Avatar";
import {Candidate} from "../interfaces/Candidate";
import Typography from "@material-ui/core/Typography/Typography";
import {defaultImage} from "../../misc/components/UploadImage";
import Grid from "@material-ui/core/Grid/Grid";

interface CandidateViewProps {
    candidate: Candidate,
}

export const CandidateView = ({candidate}: CandidateViewProps) => (
    <Grid container direction={"column"} justify={"center"} alignItems={"center"}>
        <Avatar src={candidate.image && candidate.image.base64Image || defaultImage}/>
        <Typography>{candidate.name}</Typography>
    </Grid>
);
