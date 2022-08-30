import {methods, sendRequest} from "../../utils/http";
import {getCsrfToken} from "../../utils/auth";
import {LoginResponse} from "../interfaces/LoginResponse";

const LOGIN_API = '/api/login/';
const LOGOUT_API = '/api/logout/';

export class AuthService {
    login(username: string, password: string): Promise<LoginResponse> {
        return sendRequest(LOGIN_API,
            methods.POST,
            {
                username: username,
                password: password
            },
            {
                'content-type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            false,
            true,
        );
    }

    logout(): Promise<any> {
        return sendRequest(LOGOUT_API, methods.POST)
    }

}