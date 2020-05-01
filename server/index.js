const express = require('express');
const http = require('http');
const port = process.env.PORT || 4001;
const routes = require('./routes');
const setupSocket = require('./socket');

const app = express();
app.use(routes);
const server = http.createServer(app);
setupSocket(server);

server.listen(port, () => console.log(`Listening on port ${port}`));
