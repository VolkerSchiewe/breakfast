export function sendRequest(endpoint: string, method: string, headers?, body?: object): Promise<any> {
    return fetch(endpoint, {
        method: method,
        credentials: 'same-origin',
        headers: headers,
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.ok)
            return response.json();
        if (response.status == 401) {
            deleteToken();
            location.assign('/login/')
        }
        response.json().then((res) => console.error('Error', res));
        throw Error(response.statusText);
    });
}

export const TOKEN = 'token';

export function storeToken(token: string) {
    localStorage.setItem(TOKEN, token)
}

export function getToken() {
    return localStorage.getItem(TOKEN)
}

function deleteToken() {
    localStorage.removeItem(TOKEN)
}