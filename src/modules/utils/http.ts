import {deleteUserData, getToken, getCsrfToken} from "./auth";
import axios from 'axios'

export const methods = {
    GET: 'GET',
    PATCH: 'PATCH',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};


export function sendRequest(endpoint: string, method: string, body?: object, headers?, authHeaders: boolean = true, throwException: boolean = false): Promise<any> {
    if (authHeaders)
        headers = authHeader();
    return axios.request({
        url: endpoint,
        method: method,
        headers: headers,
        data: body,
    }).then(
        response => response.data
    ).catch(err => {
        if (throwException)
            throw err;
        else if (err.response.status == 401) {
            deleteUserData();
            // redirect to login page
            location.href = '/login/';
        }
        }
    );
}

export function authHeader() {
    return {
        'content-type': 'application/json',
        'X-CSRFToken': getCsrfToken()
    };
}
