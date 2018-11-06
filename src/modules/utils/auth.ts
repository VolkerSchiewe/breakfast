import {User} from "../auth/services/user";

const TOKEN = 'token';
const USER = 'user';
const TOKEN_DATE = 'token-date';

export function storeUserData(user: User, token: string) {
    const now = new Date();
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(TOKEN_DATE, now.toISOString());
    localStorage.setItem(USER, JSON.stringify(user));
}

export function getUserData(): User {
    const tokenDate = new Date(localStorage.getItem(TOKEN_DATE));
    if (tokenDate == null)
        return null;
    const now = new Date();
    tokenDate.setTime(now.getTime() + (10 * 60 * 60 * 1000)); // 10 Hours
    if (tokenDate < now) {
        throw "Token expired";
    }
    return JSON.parse(localStorage.getItem(USER));
}

export function deleteUserData() {
    localStorage.removeItem(USER);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(TOKEN_DATE);
    localStorage.clear();
}

export function getToken() {
    return localStorage.getItem(TOKEN)
}

export function handle401(res, logout) {
    if (res.status == 401) {
        logout();
    }
}