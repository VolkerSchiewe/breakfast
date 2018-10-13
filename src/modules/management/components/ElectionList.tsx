import * as React from "react";
import {Election} from "../interfaces/Election";
import {Button, Checkbox, Paper, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {style} from "typestyle";
import {theme} from "../../layout/styles/styles";
import {Link} from "react-router-dom";
import {OpenInNew} from "@material-ui/icons"
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";

interface ElectionListProps {
    elections: Election[],
    activeElectionId?: number,
    handleActiveChange,
}

const styles = ({
    root: style({
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    }),
    table: style({
        minWidth: 700,
    }),
    button: style({
        marginLeft: 5,
        marginRight: 5,
    })
});

export const ElectionList = ({elections, activeElectionId, handleActiveChange}: ElectionListProps) => (
    <Paper className={styles.root}>
        <Toolbar>
            <div>
                <Typography variant="h6" id="tableTitle" >
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
                </TableRow>
            </TableHead>
            <TableBody>
                {elections.map(election => {
                    return (
                        <TableRow key={election.id}>
                            <TableCell component="th" scope="row">
                                <Link to={"election/" + election.id}>{election.name}</Link>
                            </TableCell>
                            <TableCell>Bla</TableCell>
                            <TableCell numeric>{1}</TableCell>
                            <TableCell numeric>{1}</TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={election.id == activeElectionId}
                                    onChange={() => handleActiveChange(election.id)}
                                    value={election.id.toString()}
                                />
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" className={styles.button}>
                                    Codes<OpenInNew/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </Paper>
);