import {methods, sendRequest} from "../../utils/http";
import {LoginResponse} from "../interfaces/LoginResponse";

const LOGIN_API = '/api/login/';
const LOGOUT_API = '/api/auth/logoutall/';

export class AuthService {
    login(username: string, password: string): Promise<LoginResponse> {
        return sendRequest(LOGIN_API,
            methods.POST,
            {username: username, password: password},
            {'content-type': 'application/json'},
            false
        );
    }

    logout(): Promise<any> {
        return sendRequest(LOGOUT_API, methods.POST)
    }

}