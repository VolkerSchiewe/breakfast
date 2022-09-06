import * as React from "react";
import { Candidate } from "../interfaces/Candidate";
import Typography from "@mui/material/Typography/Typography";
import { defaultImage } from "../../misc/components/UploadImage";
import Grid from "@mui/material/Grid/Grid";
import { style } from "typestyle";
import cc from "classcat";
import { FC } from "react";

interface CandidateViewProps {
  candidate: Candidate;
  isSelectable?: boolean;
  isSelected?: boolean;

  onClick?: (e) => any;
}

const styles = {
  img: style({
    borderRadius: "50%",
    width: 80,
    height: 80,
    textAlign: "center",
    objectFit: "cover",
  }),
  selected: style({
    border: "5px solid #ec7404",
  }),
  selectable: style({
    cursor: "pointer",
  }),
};

export const CandidateView: FC<CandidateViewProps> = ({
  candidate,
  isSelectable,
  isSelected,
  onClick,
}) => (
  <Grid
    container
    direction={"column"}
    justifyContent={"center"}
    alignItems={"center"}
    className={isSelectable === true ? styles.selectable : ""}
    onClick={onClick}
  >
    <img
      src={
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        candidate.image?.base64Image ?? defaultImage
      }
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      className={cc([isSelected && styles.selected, styles.img])}
    />
    <Typography>{candidate.name}</Typography>
  </Grid>
);
