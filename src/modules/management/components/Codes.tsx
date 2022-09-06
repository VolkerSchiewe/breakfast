import * as React from "react";
import Typography from "@mui/material/Typography/Typography";
import Grid from "@mui/material/Grid/Grid";
import { style } from "typestyle";
import { FC } from "react";

interface CodesProps {
  codes: string[];
  title: string;
}

const styles = {
  container: style({
    padding: 50,
  }),
  headline: style({
    marginBottom: 20,
  }),
  code: style({
    marginTop: 15,
  }),
};
export const Codes: FC<CodesProps> = ({ codes, title }) => (
  <Grid container justifyContent={"space-between"} className={styles.container}>
    <Grid item xs={12}>
      <Typography className={styles.headline} align={"center"} variant={"h3"}>
        {title}
      </Typography>
    </Grid>
    {codes.map((code, i) => {
      return (
        <Grid item xs={4} key={i}>
          <Typography className={styles.code} variant={"h5"} align={"center"}>
            {code}
          </Typography>
        </Grid>
      );
    })}
  </Grid>
);
