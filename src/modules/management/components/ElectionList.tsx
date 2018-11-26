import * as React from "react";
import {Election} from "../interfaces/Election";
import {style} from "typestyle";
import {theme} from "../../layout/styles/styles";
import OpenInNew from "@material-ui/icons/OpenInNew"
import Add from "@material-ui/icons/Add"
import Refresh from "@material-ui/icons/Refresh"
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Button from "@material-ui/core/Button/Button";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import IconButton from "@material-ui/core/IconButton/IconButton";
import cc from "classcat"
import {ElectionState} from "../interfaces/ElectionState";
import {StatusBadge} from "../../layout/components/StatusBadge";
import Switch from "@material-ui/core/Switch/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";

interface ElectionListProps {
    elections: Election[]
    activeElectionId?: number
    showClosed: boolean

    handleActiveChange(id)

    handleCodesClick(id)

    handleRowClick(id)

    handleNewElection()

    handleShowClosedChange()

    handleRefresh()
}

const styles = ({
    root: style({
        width: '100%',
        height: '100%',
    }),
    paper: style({
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    }),
    spacer: style({
        flex: '1 1 100%',
    }),
    tableButtons: style({
        flex: '0 0 auto',
    }),
    table: style({
        minWidth: 700,
    }),
    row: style({
        cursor: "pointer"
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
        backgroundColor: theme.palette.text.hint,
    }),
});

export const ElectionList = ({elections, activeElectionId, showClosed, handleActiveChange, handleRowClick, handleCodesClick, handleNewElection, handleRefresh, handleShowClosedChange}: ElectionListProps) => (
    <div className={styles.root}>
        <Paper className={styles.paper}>
            <Toolbar>
                <div>
                    <Typography variant="h6">
                        Wahlgänge
                    </Typography>
                </div>
                <div className={styles.spacer}/>
                <div className={styles.tableButtons}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showClosed}
                                onChange={() => handleShowClosedChange()}
                                value="showClosed"
                                color="primary"
                            />
                        }
                        label="Abgeschlossene anzeigen"
                    />
                    <IconButton onClick={handleNewElection}>
                        <Add/>
                    </IconButton>
                    <IconButton onClick={handleRefresh}>
                        <Refresh/>
                    </IconButton>
                </div>
            </Toolbar>
            <Table className={styles.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Kandidaten</TableCell>
                        <TableCell numeric>Codes</TableCell>
                        <TableCell numeric>Abgegebene Stimmen</TableCell>
                        <TableCell>Aktiv</TableCell>
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {elections.map(election => (
                            <TableRow key={election.id}
                                      className={cc([styles.row, election.state == ElectionState.CLOSED && styles.spacer])}>
                                <TableCell component="th" scope="row" onClick={() => handleRowClick(election.id)}>
                                    {election.title}
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(election.id)}>
                                    {election.candidateNames.map((value, id) =>
                                        <span key={id}>
                                            {value.title}: {value.names && value.names.join(', ')}<br/>
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell numeric onClick={() => handleRowClick(election.id)}>
                                    {election.codes && election.codes.length}
                                </TableCell>
                                <TableCell numeric onClick={() => handleRowClick(election.id)}>
                                    {election.voteCount}
                                </TableCell>
                                <TableCell padding={"checkbox"}>
                                    {election.state == ElectionState.CLOSED ?
                                        <StatusBadge state={election.state}/>
                                        :
                                        <Checkbox
                                            checked={election.id == activeElectionId}
                                            onChange={() => handleActiveChange(election.id)}
                                            value={election.id.toString()}
                                        />
                                    }
                                </TableCell>
                                <TableCell>
                                    {election.state != ElectionState.CLOSED &&
                                    <Button variant="outlined" onClick={() => handleCodesClick(election)}>
                                        Codes<OpenInNew/>
                                    </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </Paper>
    </div>
);