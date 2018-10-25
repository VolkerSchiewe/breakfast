export const methods = {
    GET: 'GET',
    PATCH: 'PATCH',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};


export function sendRequest(endpoint: string, method: string, body?: object, headers?, authHeaders: boolean = true): Promise<any> {
    if (authHeaders)
        headers = authHeader();
    return fetch(endpoint, {
        method: method,
        credentials: 'same-origin',
        headers: headers,
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.ok) {
            if (response.status !== 204)
                return response.json();
            else
                return '';
        }
        throw response;
    });
}

export function authHeader() {
    return {
        'content-type': 'application/json',
        'authorization': 'Token ' + getToken(),
    };
}

export const TOKEN = 'token';

export function storeToken(token: string) {
    //todo store creation date
    localStorage.setItem(TOKEN, token)
}

export function getToken() {
    // todo validate creation date
    return localStorage.getItem(TOKEN)
}

export function deleteToken() {
    localStorage.removeItem(TOKEN);
    localStorage.clear();
}
