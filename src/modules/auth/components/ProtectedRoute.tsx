import * as React from "react";
import {Route, Redirect} from "react-router-dom";
import {AuthConsumer, AuthInterface} from "./AuthContext";

export const ProtectedRoute = ({component: ChildComponent, ...rest}) => {
    return <Route {...rest} render={props => (
        <AuthConsumer>
            {({isAuthenticated}: AuthInterface) => (
                <div>
                    {isAuthenticated ? (
                        <ChildComponent {...props}/>
                    ) : (
                        <Redirect to="/login/"/>
                    )}
                </div>
            )}
        </AuthConsumer>
    )}/>
};
