// this class is responsible for connecting with the client over two websockets
// and handling sending/receiving data over them
const WebSocket = require('ws');

module.exports = function(server, port) {
    const wss = new WebSocket.Server({ server });

    let pos = { x: 0, y: 0 };
    wss.on('error', handleSocketError);
    wss.on('connection', function connection(ws) {
        // handle errors in this clients socket
        ws.on('error', handleSocketError);

        ws.on('message', function incoming(message) {
            let keys = JSON.parse(message);
            if (keys.includes('up'))
                pos.y -= 5;
            if (keys.includes('down'))
                pos.y += 5;
            if (keys.includes('left'))
                pos.x -= 5;
            if (keys.includes('right'))
                pos.x += 5;

            ws.send(JSON.stringify(pos));
        });

        ws.send(JSON.stringify(pos));
    });
}

function handleSocketError(error) {
    if (error) {
        // ignore ECONNRESET. Its just chrome closing/reloading a tab
        if (error.code === 'ECONNRESET')
            return;

        console.log(error);
    }
}