// this is the server. It just serves everything statically in the dist folder
const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 8080;

// statically serve dist/
app.use('/', express.static(path.join(__dirname, 'dist')))

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// handle errors on the web socket server
wss.on('error', handleSocketError);

// handle connections to the web socket server
wss.on('connection', function connection(ws) {
    // handle errors in this clients socket
    ws.onerror = handleSocketError;

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    // send initial handshake
    ws.send('test', handleSocketError);
});

// start server
server.listen(port, () => console.log('Listening on port ' + port));


function handleSocketError(error) {
    if (error) {
        // ignore ECONNRESET. Its just chrome closing/reloading a tab
        if(error.code === 'ECONNRESET')
            return;

        console.log(error);
    }
}
