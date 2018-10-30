import * as React from "react";
import {Route, Redirect} from "react-router-dom";
import {AuthConsumer} from "./AuthContext";
import {AuthInterface} from "../interfaces/AuthInterface";

export const AdminRoute = ({component: ChildComponent, ...rest}) => {
    return <Route {...rest} render={props => (
        <AuthConsumer>
            {({user}: AuthInterface) => (
                <div>
                    {user && user.isAdmin ? (
                        <ChildComponent {...props}/>
                    ) : (
                        <Redirect to="/login/"/>
                    )}
                </div>
            )}
        </AuthConsumer>
    )}/>
};
