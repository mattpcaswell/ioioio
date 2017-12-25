// this is the server. It just serves everything statically in the dist folder
const express = require('express');
const http = require('http');
const path = require('path');
const gameServer = require('./server/gameServer.js');

const app = express();
const port = process.env.PORT || 8080;

// statically serve dist/
app.use('/', express.static(path.join(__dirname, 'dist')))

// create a server from the app
const server = http.createServer(app);

// start the servers
gameServer(server);
server.listen(port, () => console.log('Listening on port ' + port));