import * as React from "react";
import {Election} from "../interfaces/Election";
import {
    Button,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";
import {style} from "typestyle";
import {theme} from "../../layout/styles/styles";
import {OpenInNew, Add} from "@material-ui/icons"
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";

interface ElectionListProps {
    elections: Election[]
    activeElectionId?: number

    handleActiveChange(id)

    handleCodesClick(id)

    handleRowClick(id)

    handleNewElection()
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
});

export const ElectionList = ({elections, activeElectionId, handleActiveChange, handleRowClick, handleCodesClick, handleNewElection}: ElectionListProps) => (
    <div className={styles.root}>
        <Paper className={styles.paper}>
            <Toolbar>
                <div>
                    <Typography variant="h6" id="tableTitle">
                        Wahlgänge
                    </Typography>
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
                        <TableCell/>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {elections.map(election => (
                            <TableRow key={election.id} className={styles.row}>
                                <TableCell component="th" scope="row" onClick={() => handleRowClick(election.id)}>
                                    {election.title}
                                </TableCell>
                                <TableCell onClick={() => handleRowClick(election.id)}>
                                    {election.candidateNames}
                                </TableCell>
                                <TableCell numeric onClick={() => handleRowClick(election.id)}>
                                    {election.codes && election.codes.length}
                                </TableCell>
                                <TableCell numeric onClick={() => handleRowClick(election.id)}>
                                    {election.voteCount}
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={election.id == activeElectionId}
                                        onChange={() => handleActiveChange(election.id)}
                                        value={election.id.toString()}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleCodesClick(election)}>
                                        Codes<OpenInNew/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
            <Grid className={styles.footer}>
                <Button variant={"contained"} color={"default"} onClick={handleNewElection}>
                    <Add/>
                    Neu
                </Button>
            </Grid>
        </Paper>
    </div>
);