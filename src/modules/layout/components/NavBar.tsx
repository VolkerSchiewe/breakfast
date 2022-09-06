import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button/Button";
import { style } from "typestyle";
import { Link } from "react-router-dom";
import { theme } from "../styles/styles";
import { useAuth } from "../../auth/components/AuthContext";
import { FC } from "react";

interface NavBarProps {
  title: string;

  onClick?: () => any;
}

const styles = {
  root: style({
    flexGrow: 1,
    marginBottom: 50,
  }),
  appBar: style({
    backgroundColor: theme.palette.primary.main,
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
    color: "white",
  }),
  logout: style({
    color: "white",
  }),
};

const AdminLink = (props): React.ReactElement => (
  <Link to={"/elections/"} {...props} />
);
const LoginLink = (props): React.ReactElement => (
  <Link to={"/login/"} {...props} />
);
export const NavBar: FC<NavBarProps> = ({ title }) => {
  const { user, logout } = useAuth();
  return (
    <div className={styles.root}>
      <AppBar position="static" color="primary" className={styles.appBar}>
        <Toolbar>
          <img className={styles.img} src={"/static/images/jugend_schaf.png"} />
          <Typography
            variant="h6"
            className={styles.text}
            component={user?.isAdmin === true ? AdminLink : LoginLink}
          >
            {title}
          </Typography>
          {user?.isAdmin === true && (
            <Button className={styles.logout} onClick={() => logout()}>
              {"Logout " + user.username}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
