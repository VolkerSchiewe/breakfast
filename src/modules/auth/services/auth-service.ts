import {authHeader, sendRequest} from "../../utils/http";
import {LoginResponse} from "../interfaces/login-response";

const LOGIN_API = '/api/login/';
const LOGOUT_API = '/api/auth/logout/';

export class AuthService {
    login(username: string, password: string): Promise<LoginResponse> {
        console.log('USER: ', btoa(username + ':' + password));
        const basic_auth_header = {
            'content-type': 'application/json',
            'Authorization': 'Basic ' + btoa(username + ':' + password)
        };
        console.log(basic_auth_header);

        return sendRequest(LOGIN_API,
            'POST',
            basic_auth_header,
            {},
            false
        );
    }

    logout(): Promise<any> {
        return sendRequest(LOGOUT_API, 'POST')
    }

}