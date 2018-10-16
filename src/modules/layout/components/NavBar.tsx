import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {style} from 'typestyle';
import {Link} from "react-router-dom";

interface NavBarProps {
    title: string

    onClick?()
}

const styles = {
    root: style({
        flexGrow: 1,
    }),
    img: style({
        width: 50,
        height: 50,
        marginRight: 5,
        textDecoration: "none",

        // height: "100%",
    }),
    text: style({
        textDecoration: "none",

        color: "white"
    })
};
const MainLink = props => (<Link to={'/'} {...props}/>);
export const NavBar = ({title}: NavBarProps) => (
    <div className={styles.root}>
        <AppBar position="static">
            <Toolbar>
                <img className={styles.img}
                     src={"https://ebu-breakfast.herokuapp.com/static/images/jugend_schaf.png"}/>
                <Typography variant="h6" className={styles.text} component={MainLink}>
                    {title}
                </Typography>
            </Toolbar>
        </AppBar>
    </div>
);
