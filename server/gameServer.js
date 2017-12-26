const WebSocket = require('ws');

let players = [];

module.exports = function (server, port) {
    const wss = new WebSocket.Server({ server });

    wss.on('error', handleSocketError);
    wss.on('connection', function (ws, req) {
        let username = "";

        ws.on('message', onmessage);
        ws.on('error', handleSocketError);
        ws.on('close', onclose);

        let firstMessage = true;
        function onmessage(message) {
            message = JSON.parse(message);

            if (firstMessage) {
                username = createUsername(message, ws);
                firstMessage = false;
            }

            playerIndex = getPlayerWithUsername(username);
            if (playerIndex != -1 && message.counterTag > players[playerIndex].recCount) {
                // valid message
                players[playerIndex].recCount = message.counterTag;
                handleMessage(message, playerIndex, ws);
            }
        }

        function onclose(event) {
            // websocket closing. Remove player from the list
            let index = getPlayerWithUsername(username);
            if (index != -1) {
                console.log(username + ' disconnected');
                players.splice(index, 1);
            }
        }
    });
}

function handleMessage(message, playerIndex) {
    const keys = message.payload;
    let player = players[playerIndex];

    if (keys.includes('up'))
        player.y -= 5;
    if (keys.includes('down'))
        player.y += 5;
    if (keys.includes('left'))
        player.x -= 5;
    if (keys.includes('right'))
        player.x += 5;

    send({ x: player.x, y: player.y }, playerIndex);
}

function send(message, playerIndex) {
    message = { payload: message, counterTag: players[playerIndex].sendCount++ };

    players[playerIndex].ws1.send(JSON.stringify(message));
    if (players[playerIndex].ws2) {
        players[playerIndex].ws2.send(JSON.stringify(message));
    } else {
        console.log('NO SECOND WS');
    }
}

function createUsername(message, ws) {
    let username = null
    if (!message.secondConnecting) {
        // message.username is their wanted username
        username = findUniqueUsername(message.username);
        players.push({ username: username, x: 0, y: 0, ws1: ws, recCount: 0, sendCount: 0 });
        ws.send(JSON.stringify({ username: username }));
    } else {
        // second socket connecting
        username = message.username;
        players[getPlayerWithUsername(username)].ws2 = ws;
        console.log(username + ' connected');
    }

    return username;
}

// gets the index of the player with the given username
function getPlayerWithUsername(username) {
    for(let index = 0; index < players.length; index++) {
        if (players[index].username === username) {
            return index;
        }
    }

    return -1;
}

// finds an untaken username by adding a 2 or a 3 ect... to the end of the username
function findUniqueUsername(username) {
    if (getPlayerWithUsername(username) == -1) {
        return username;
    } else {
        let addition = 2;   // start with Matt2 not Matt1 because theres already a Matt
        while (getPlayerWithUsername(username + addition) != -1) {
            addition++;
        }

        return username + addition;
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
