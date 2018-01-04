const WebSocket = require('ws');
const { GameSocket, handleNewConnection } = require('./gameSocket.js');
const { PlayerList } = require('./playerList.js');

module.exports = class GameServer {
    constructor(server) {
        const wss = new WebSocket.Server({ server });
        const self = this;

        this.playerList = new PlayerList();

        wss.on('error', self.handleSocketError);
        wss.on('connection', ws => {
            handleNewConnection(ws, this);
        });
    }

    handleMessage(message, playerIndex, gameSocket) {
        const keys = message.payload;
        let player = this.playerList.players[playerIndex];

        if (keys.includes('up'))
            player.data.y -= 5;
        if (keys.includes('down'))
            player.data.y += 5;
        if (keys.includes('left'))
            player.data.x -= 5;
        if (keys.includes('right'))
            player.data.x += 5;

        // gameSocket.send({ x: player.x, y: player.y }, playerIndex);
        this.sendAllPlayerPositions(gameSocket);
    }

    sendAllPlayerPositions(socket) {
        let payload = [];
        for(let i = 0; i < this.playerList.players.length; i++) {
            payload.push(this.playerList.players[i].data);
        }

        socket.send(payload);
    }

    handleSocketError(error) {
        if (error) {
            // ignore ECONNRESET. Its just chrome closing/reloading a tab
            if (error.code === 'ECONNRESET')
                return;

            console.log('server socket error: ');
            console.log(error);
        }
    }
}
