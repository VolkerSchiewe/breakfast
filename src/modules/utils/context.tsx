import * as React from "react";
import {Component} from "react";
import {AuthInterface} from "../auth/components/AuthContext";
import {AuthConsumer} from "../auth/components/AuthContext";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withAuthContext<P extends { appContext?: AuthInterface },
    R = Omit<P, 'appContext'>>(
    Component: React.ComponentClass<P> | React.StatelessComponent<P>
): React.SFC<R> {
    return function BoundComponent(props: R) {
        return (
            <AuthConsumer>
                {value => <Component {...props} appContext={value}/>}
            </AuthConsumer>
        );
    };
}