// this is the server. It just serves everything statically in the dist folder
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use('/', express.static(path.join(__dirname, 'dist')))

app.listen(port, () => console.log('Listening on port ' + port));
