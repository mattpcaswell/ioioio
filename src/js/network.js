console.log("attempting to create web socket");
const socket = new WebSocket("ws://" + location.host);

socket.onopen = (event) => {
    console.log("opened websocket with event: ");
    console.log(event);
};

socket.onmessage = (event) => {
    console.log("websocket got message: ");
    console.log(event.data);

    socket.send(event.data);
};

socket.onclose = (event) => {
    console.log("websocket closed with event: ");
    console.log(event);
}

socket.onerror = (event) => {
    console.log("websocket error with event: ");
    console.log(event);
}