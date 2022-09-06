import * as React from "react";
import {
  ElectionState,
  getElectionStateText,
} from "../../management/interfaces/ElectionState";
import Typography from "@mui/material/Typography/Typography";
import { style } from "typestyle";
import { theme } from "../styles/styles";
import { FC } from "react";

interface StatusBadgeProps {
  state: ElectionState;
}

const styles = {
  container: style({
    margin: "auto",
  }),
  statusText: style({
    backgroundColor: theme.palette.text.primary,
    padding: theme.spacing(1),
    color: "white",
    borderRadius: 5,
  }),
};

export const StatusBadge: FC<StatusBadgeProps> = ({ state }) => (
  <div className={styles.container}>
    <Typography className={styles.statusText} color={"secondary"}>
      {getElectionStateText(state)}
    </Typography>
  </div>
);
