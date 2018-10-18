export function sendRequest(endpoint: string, method: string, headers?, body?: object): Promise<any> {
    return fetch('http://localhost:8000' + endpoint, {
        method: method,
        credentials: 'same-origin',
        headers: headers,
        body: JSON.stringify(body),
    }).then((response) => {
        if (response.ok)
            return response.json();
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