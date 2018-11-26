import Sockette from "sockette"

export function openWebsocket(endpoint: string, onMessage: (e) => void) {

    const protocol = location.protocol == 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//${location.host}/${endpoint}`;
    const socket = new Sockette(url, {
        timeout: 3000,
        maxAttempts: 10,
        onopen: e => onOpen(e),
        onmessage: onMessage,
        onclose: () => onClose(),
        onerror: e => onError(e),
    });
    const onOpen = (e) => {
        socket.ws = e.target;
        if (process.env.NODE_ENV !== 'production')
            console.log(endpoint + ' Connected!')
    };

    const onClose = () => {
        if (process.env.NODE_ENV !== 'production')
            console.log(endpoint + ' Closed!')
    };

    const onError = (e) => {
        console.log(endpoint + ' Error!', e)
    };

    return socket
}
