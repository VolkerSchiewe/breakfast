import {User} from "../auth/services/user";

const TOKEN = 'token';
const USER = 'user';


export function storeUserData(user: User, token: string) {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(USER, JSON.stringify(user));
}

export function getUserData(): User {
    return JSON.parse(localStorage.getItem(USER))
}

export function deleteUserData() {
    localStorage.removeItem(USER);
    localStorage.removeItem(TOKEN);
    localStorage.clear();
}

export function getToken() {
    // todo validate creation date
    return localStorage.getItem(TOKEN)
}
