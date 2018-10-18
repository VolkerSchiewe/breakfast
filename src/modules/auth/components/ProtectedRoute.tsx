import * as React from "react";
import {Route, Redirect} from "react-router-dom";

export const ProtectedRoute = ({component: ChildComponent, isAuthenticated, ...rest}) => {
    return <Route {...rest} render={props => {
        if (!isAuthenticated) {
            return <Redirect to="/login"/>;
        } else {
            return <ChildComponent {...props} />
        }
    }}/>
};