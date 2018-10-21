import * as React from 'react';

export interface AuthInterface {
    isAuthenticated: boolean,
    isAdmin: boolean,

    login(name: string, password: string): void,

    logout(): void,
}

const ctx = React.createContext<AuthInterface>({
    isAdmin: false,
    isAuthenticated: false,
    login: (name: string, password: string) => {
        throw new Error('login() not implemented');
    },
    logout: () => {
        throw new Error('logout() not implemented');
    }
});

export const AuthProvider = ctx.Provider;
export const AuthConsumer = ctx.Consumer;