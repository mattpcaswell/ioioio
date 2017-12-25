let receiveCounter = 0;
let sendCounter = 0;

export default class Socket {
    constructor() {
        this.socket1 = new WebSocket("wss://" + location.host);
        // this.socket2 = new WebSocket("ws://" + location.host);

        this.socket1.onopen = (event) =>  console.log('socket 1 opened');
        // this.socket2.onopen = (event) =>  console.log('socket 2 opened');

        this.socket1.onmessage = (event) => this.onmessage(event);
        // this.socket2.onmessage = (event) => this._onmessage(event);

        this.socket1.onclose = (event) => console.log("socket1 closed");
        // this.socket2.onclose = (event) => console.log("socket2 closed");

        this.socket1.onerror = (event) => {
            console.log("socket1 error with event: ");
            console.log(event);
        }
        // this.socket2.onerror = (event) => {
        //     console.log("socket2 error with event: ");
        //     console.log(event);
        // }
    }

    send(data) {
        sendCounter++;
        this.socket1.send(data);
        // this.socket2.send(data);
    }
}