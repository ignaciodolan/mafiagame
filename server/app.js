const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);

const players = [];
// socket.io server
io.on('connection', function (socket) {
  console.log('a user connected');
  // create a new player and add it to our players object
  players.push({
    playerId: socket.id,
    name: `user${socket.id}`
  })
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // send the players object to all the players
  socket.broadcast.emit('currentPlayers', players);
  console.log(players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected');

    // remove this player from our players object
    const playerIndex = players.findIndex((player) => player.playerId ===socket.id);
    if (playerIndex > -1) {
        players.splice(playerIndex, 1);
    }
    socket.broadcast.emit('currentPlayers', players);

    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });
});


server.listen(port, () => console.log(`Listening on port ${port}`));
