import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {style} from 'typestyle';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button/Button";
import {AuthConsumer} from "../../auth/components/AuthContext";
import {AuthInterface} from "../../auth/interfaces/AuthInterface";

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

const MainLink = props => (<Link to={'/elections'} {...props}/>);
export const NavBar = ({title}: NavBarProps) => (
    <div className={styles.root}>
        <AuthConsumer>
            {({user, logout}: AuthInterface) => (
                <AppBar position="static">
                    <Toolbar>
                        <img className={styles.img}
                             src={'/static/images/jugend_schaf.png'}/>
                        <Typography variant="h6" className={styles.text} component={MainLink}>
                            {title}
                        </Typography>
                        {user &&
                        <Button className={styles.logout} onClick={() => logout()}>{"Logout " + user.username}</Button>
                        }
                    </Toolbar>
                </AppBar>
            )}
        </AuthConsumer>
    </div>
);
