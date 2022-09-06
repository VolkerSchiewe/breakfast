import { deleteUserData, getCsrfToken } from "./auth";
import axios, { AxiosRequestHeaders } from "axios";

export const methods = {
  GET: "GET",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export async function sendRequest(
  endpoint: string,
  method: string,
  body?: object,
  headers?: AxiosRequestHeaders,
  authHeaders: boolean = true,
  throwException: boolean = false
): Promise<any> {
  if (authHeaders) {
    headers = authHeader();
  }
  return await axios
    .request({
      url: endpoint,
      method,
      headers,
      data: body,
    })
    .then((response) => response.data)
    .catch((err) => {
      if (throwException) {
        throw err;
      } else if (err.response.status === 401) {
        deleteUserData();
        // redirect to login page
        location.href = "/login/";
      }
    });
}

export function authHeader(): AxiosRequestHeaders {
  return {
    "content-type": "application/json",
    "X-CSRFToken": getCsrfToken() ?? "",
  };
}
