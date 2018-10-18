import {sendRequest} from "../../utils/http";
import {LoginResponse} from "../interfaces/login-response";

const LOGIN_API = '/api/login/';

export class AuthService {
    login(username: string, password: string): Promise<LoginResponse> {
        return sendRequest(LOGIN_API,
            'POST',
            {
                'content-type': 'application/json',
            },
            {
                'username': username,
                'password': password,
            },
        );
    }

}