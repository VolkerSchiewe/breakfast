import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {style} from 'typestyle';

interface NavBarProps {
    title: string,
}

const styles = {
    root: style({
        flexGrow: 1,
    }),
    flex: style({
        flexGrow: 1,
    }),
};

export const NavBar = ({title}: NavBarProps) => (
    <div className={styles.root}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="title" color="inherit" className={styles.flex}>
                    {title}
                </Typography>
                {/*<Button color="inherit">Login</Button>*/}
            </Toolbar>
        </AppBar>
    </div>
);
