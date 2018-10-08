import * as React from "react";
import {Election} from "../interfaces/Election";
import {Typography,} from "@material-ui/core";
import {style} from "typestyle";
import {theme} from "../../layout/styles";
import {Link} from "react-router-dom";
import {SubElection} from "../interfaces/SubElection";

interface ElectionListProps {
    election: Election,
    subElections: SubElection[],
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

export const EditElection = ({election, subElections}: ElectionListProps) => (
    <div>
        <Typography variant="display2" gutterBottom>
            {election.name}
        </Typography>
    </div>
);