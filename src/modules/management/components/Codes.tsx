import * as React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import Grid from "@material-ui/core/Grid/Grid";
import {style} from "typestyle";

interface CodesProps {
    codes: string[]
    title: string
}

const styles = {
    container: style({
        padding: 50
    }),
    headline: style({
        marginBottom: 20,
    }),
    code: style({
        marginTop: 15
    }),
};
export const Codes = ({codes, title}: CodesProps) => (
    <Grid container justify={"space-between"} className={styles.container}>
        <Grid item xs={12}>
            <Typography className={styles.headline} align={"center"} variant={"h3"}>{title}</Typography>
        </Grid>
        {codes.map((code, i) => {
                return (
                    <Grid item xs={4} key={i}>
                        <Typography className={styles.code} variant={"h5"} align={"center"}>{code}</Typography>
                    </Grid>
                )
            }
        )}
    </Grid>
);
