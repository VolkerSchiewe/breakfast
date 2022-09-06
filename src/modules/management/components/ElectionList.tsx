import * as React from "react";
import { Election } from "../interfaces/Election";
import { style } from "typestyle";
import { theme } from "../../layout/styles/styles";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Add from "@mui/icons-material/Add";
import Refresh from "@mui/icons-material/Refresh";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import Typography from "@mui/material/Typography/Typography";
import Paper from "@mui/material/Paper/Paper";
import Table from "@mui/material/Table/Table";
import TableHead from "@mui/material/TableHead/TableHead";
import TableRow from "@mui/material/TableRow/TableRow";
import TableCell from "@mui/material/TableCell/TableCell";
import TableBody from "@mui/material/TableBody/TableBody";
import Button from "@mui/material/Button/Button";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import IconButton from "@mui/material/IconButton/IconButton";
import cc from "classcat";
import { ElectionState } from "../interfaces/ElectionState";
import { StatusBadge } from "../../layout/components/StatusBadge";
import Switch from "@mui/material/Switch/Switch";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import { FC } from "react";

interface ElectionListProps {
  elections: Election[];
  activeElectionId?: number;
  showClosed: boolean;

  handleActiveChange: (id) => any;

  handleCodesClick: (id) => any;

  handleRowClick: (id) => any;

  handleNewElection: () => any;

  handleShowClosedChange: () => any;

  handleRefresh: () => any;
}

const styles = {
  root: style({
    width: "100%",
    height: "100%",
  }),
  paper: style({
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  }),
  spacer: style({
    flex: "1 1 100%",
  }),
  tableButtons: style({
    flex: "0 0 auto",
  }),
  table: style({
    minWidth: 700,
  }),
  row: style({
    cursor: "pointer",
  }),
  footer: style({
    padding: 5,
  }),
  fab: style({
    position: "absolute",
    bottom: "5%",
    right: "5%",
  }),
  finished: style({
    backgroundColor: theme.palette.grey[100],
  }),
  fixPadding: style({
    padding: 9,
  }),
};

export const ElectionList: FC = ({
  elections,
  activeElectionId,
  showClosed,
  handleActiveChange,
  handleRowClick,
  handleCodesClick,
  handleNewElection,
  handleRefresh,
  handleShowClosedChange,
}: ElectionListProps) => (
  <div className={styles.root}>
    <Paper className={styles.paper}>
      <Toolbar>
        <div>
          <Typography variant="h6">Wahlgänge</Typography>
        </div>
        <div className={styles.spacer} />
        <div className={styles.tableButtons}>
          <FormControlLabel
            control={
              <Switch
                checked={showClosed}
                onChange={() => handleShowClosedChange()}
                value="showClosed"
                color="primary"
                classes={{ switchBase: styles.fixPadding }}
              />
            }
            label="Abgeschlossene anzeigen"
          />
          <IconButton onClick={handleNewElection} size="large">
            <Add />
          </IconButton>
          <IconButton onClick={handleRefresh} size="large">
            <Refresh />
          </IconButton>
        </div>
      </Toolbar>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Kandidaten</TableCell>
            <TableCell align="right">Codes</TableCell>
            <TableCell align="right">Abgegebene Stimmen</TableCell>
            <TableCell>Aktiv</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {elections.map((election) => (
            <TableRow
              key={election.id}
              className={cc([
                styles.row,
                election.state === ElectionState.CLOSED && styles.finished,
              ])}
            >
              <TableCell
                component="th"
                scope="row"
                onClick={() => handleRowClick(election.id)}
              >
                {election.title}
              </TableCell>
              <TableCell onClick={() => handleRowClick(election.id)}>
                {election.candidateNames?.map((value, id) => (
                  <span key={id}>
                    {value.title}: {value.names?.join(", ")}
                    <br />
                  </span>
                ))}
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleRowClick(election.id)}
              >
                {election.codes?.length}
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleRowClick(election.id)}
              >
                {election.voteCount}
              </TableCell>
              <TableCell padding={"checkbox"}>
                {election.state === ElectionState.CLOSED ? (
                  <StatusBadge state={election.state} />
                ) : (
                  <Checkbox
                    checked={election.id === activeElectionId}
                    onChange={() => handleActiveChange(election.id)}
                    value={election.id.toString()}
                  />
                )}
              </TableCell>
              <TableCell>
                {election.state !== ElectionState.CLOSED && (
                  <Button
                    variant="outlined"
                    onClick={() => handleCodesClick(election)}
                  >
                    Codes
                    <OpenInNew />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </div>
);
