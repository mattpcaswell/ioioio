const express = require('express');
const path = require('path');

const app = express();
const port = process.env.port || 5000;

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/deps', express.static(path.join(__dirname, 'node_modules')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => console.log('Listening on port ' + port));
