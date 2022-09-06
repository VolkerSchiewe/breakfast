import { methods, sendRequest } from "../../utils/http";
import { getCsrfToken } from "../../utils/auth";
import { LoginResponse } from "../interfaces/LoginResponse";

const LOGIN_API = "/api/login/";
const LOGOUT_API = "/api/logout/";

export class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    return await sendRequest(
      LOGIN_API,
      methods.POST,
      {
        username,
        password,
      },
      {
        "content-type": "application/json",
        "X-CSRFToken": getCsrfToken(),
      },
      false,
      true
    );
  }

  async logout(): Promise<any> {
    return await sendRequest(LOGOUT_API, methods.POST);
  }
}
