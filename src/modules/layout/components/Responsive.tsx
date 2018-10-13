import * as React from "react";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Grid from "@material-ui/core/Grid/Grid";
import {style} from "typestyle";

interface ResponsiveProps {
    edgeSize: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    children,
}

const styles = {
    container: style({
        margin: 5,
        width: '100%',
    })
};

export function Responsive({edgeSize, children}: ResponsiveProps) {
    return (
        <div>
            <Grid container>
                <Hidden smDown>
                    <Grid item xs={edgeSize}/>
                </Hidden>
                <Grid item xs className={styles.container}>
                    {children}
                </Grid>
                <Hidden smDown>
                    <Grid item xs={edgeSize}/>
                </Hidden>
            </Grid>
        </div>
    )
}
