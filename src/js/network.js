let receiveCounter = 0;
let sendCounter = 0;

let websocketPrefix = PRODUCTION ? "wss://" : "ws://";

export default class Socket {
    constructor(username) {
        // open socket 1
        this.socket1 = new WebSocket(websocketPrefix + location.host);
        this.socket1.onerror = this.socketError;

        // once connected, send the username and wait to get the official username back
        this.socket1.onopen = (event) =>  {
           this.socket1.send(JSON.stringify({username: username}));
           this.socket1.onmessage = (event) => {
                let data = JSON.parse(event.data);

               // got official username
               this.username = data.username;

               this.socket2 = new WebSocket(websocketPrefix + location.host);
               this.socket2.onerror = this.socketError;
               this.socket2.onopen = (event) => {
                   // send it through the second socket too
                   this.socket2.send(JSON.stringify({ username: this.username, secondConnecting: 1 }));

                   // then setup the normal callbacks
                   this.socket1.onmessage = (event) => this._onmessage(event);
                   this.socket2.onmessage = (event) => this._onmessage(event);
                   this.socket1.onclose = (event) => console.log("socket1 closed");
                   this.socket2.onclose = (event) => console.log("socket2 closed");

                   // tell the listeners that we're connected
                   console.log('connected with username: ' + this.username);
                   this.connected();
               };
           };
        };

    }

    send(data) {
        data = { payload: data, counterTag: sendCounter++ };
        data = JSON.stringify(data);

        if (this.socket1.readyState === this.socket1.OPEN)
            this.socket1.send(data);
        if (this.socket2.readyState === this.socket2.OPEN)
            this.socket2.send(data);
    }

    _onmessage(event) {
        let data = JSON.parse(event.data);

        if (data.counterTag > receiveCounter) {
            receiveCounter = data.counterTag;
            this.onmessage(data.payload);
        }
    }

    socketError(event) {
        console.log("socket error with event: ");
        console.log(event);
    }
}