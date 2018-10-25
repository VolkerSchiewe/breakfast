import Sockette from "sockette"

export function openWebsocket(endpoint: string, onMessage: (e) => void) {
    //TODO wss:// support
    const url = "ws://localhost:8000/" + endpoint;
    new Sockette(url, {
        timeout: 3000,
        maxAttempts: 10,
        onopen: () => console.log(endpoint + ' Connected!'),
        onmessage: onMessage,
        onclose: () => console.log(endpoint + ' Elections Closed!'),
        onerror: e => console.log(endpoint + ' Elections Error:', e)
    });
}
