const Player = require('./player.js');

class GameSocket {
    constructor(ws1, username, gameServer) {
        this.ws1 = ws1;
        this.username = username;
        this.gameServer = gameServer;
        this.playerList = this.gameServer.playerList;

        this.ws1.on('message', this.onmessage.bind(this));
        this.ws1.on('close', this.onclose.bind(this));

        this.recCount = 0;
        this.sendCount = 0;
    }

    connectSecondWs(ws2) {
        this.ws2 = ws2;

        this.ws1.on('message', this.onmessage.bind(this));
        this.ws1.on('close', this.onclose.bind(this));
    }

    send(payload) {
        let message = JSON.stringify({ payload: payload, counterTag: this.sendCount++ });

        this.ws1.send(message);
        if (this.ws2) {
            this.ws2.send(message);
        } else {
            console.log('NO SECOND WS');
        }
    }

    onmessage(message) {
        message = JSON.parse(message);

        let playerIndex = this.playerList.getPlayerWithUsername(this.username);
        if (playerIndex != -1 && message.counterTag > this.recCount) {
            // valid message
            this.recCount = message.counterTag;
            this.gameServer.handleMessage(message, playerIndex, this);
        }
    }

    onclose(event) {
        // websocket closing. Remove player from the list
        this.gameServer.playerList.removePlayer(this.username);
        this.gameServer.sendPlayerDisconnected(this.username);

        console.log(this.username + " disconnected");
    }

}

function handleSocketError(error) {
    if (error) {
        // ignore ECONNRESET. Its just chrome closing/reloading a tab
        if (error.code === 'ECONNRESET')
            return;

        console.log('server socket error: ');
        console.log(error);
    }
}

function handleNewConnection(ws, gameServer) {
    ws.on('error', handleSocketError);

    ws.on('message', function newConnectionOnMessage(message) {
        message = JSON.parse(message);
        if (!message.secondConnecting) {
            // first connection. Create new gameSocket and player and add it to the playerList
            let username = gameServer.playerList.findUniqueUsername(message.username);
            let gameSocket = new GameSocket(ws, username, gameServer);
            let player = new Player(gameSocket, username);

            gameServer.playerList.addPlayer(player);

            // then send back the given username to the user
            ws.send(JSON.stringify({ username: username }));
        } else {
            // second connection. read username and add ws to gameSocket
            let username = message.username;
            let playerIndex = gameServer.playerList.getPlayerWithUsername(username);
            gameServer.playerList.players[playerIndex].gameSocket.ws2 = ws;

            // send new player message to all clients
            gameServer.sendNewPlayerConnected(username);
            console.log(username + " connected");
        }

        ws.removeEventListener('message', newConnectionOnMessage);
    });
}

module.exports = { GameSocket: GameSocket, handleNewConnection: handleNewConnection };