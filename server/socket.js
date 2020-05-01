const socketIo = require('socket.io');
const setupGame = require('./src/game');

const setupSocket = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => setupGame(io, socket));
};

module.exports = setupSocket;
