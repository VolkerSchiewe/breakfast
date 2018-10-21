import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {style} from 'typestyle';
import {Link} from "react-router-dom";
import {withAuthContext} from "../../utils/context";
import {AuthConsumer, AuthInterface} from "../../auth/components/AuthContext";
import Button from "@material-ui/core/Button/Button";

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
    }),
    text: style({
        flexGrow: 1,
        textDecoration: "none",
        color: "white"
    }),
    logout: style({
        color: "white",
    }),
};
const MainLink = props => (<Link to={'/'} {...props}/>);
export const NavBar = ({title}: NavBarProps) => (
    <div className={styles.root}>
        <AuthConsumer>
            {({isAuthenticated, logout}: AuthInterface) => (
                <AppBar position="static">
                    <Toolbar>
                        <img className={styles.img}
                             src={'/static/images/jugend_schaf.png'}/>
                        <Typography variant="h6" className={styles.text} component={MainLink}>
                            {title}
                        </Typography>
                        {isAuthenticated &&
                        <Button className={styles.logout} onClick={() => logout()}>Logout</Button>
                        }
                    </Toolbar>
                </AppBar>
            )}
        </AuthConsumer>
    </div>
);
