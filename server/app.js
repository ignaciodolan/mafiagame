const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;
const routes = require('./routes/index');
const shuffle = require('./helpers/shuffle');

const app = express();
app.use(routes);
const server = http.createServer(app);
const io = socketIo(server);

const CARDS = ['POLICE', 'DOCTOR', 'GOD', 'THIEF', 'CITIZEN'];
const ROOMS = [{ id: '6gEmrsD3', players: [] }];

const sendMessageToAllMembers = ({ roomId, event, data }) => {
  const gameSocket = io.sockets.in(roomId);
  gameSocket.emit(event, data);
};

const sendMessageToPlayer = ({ playerId, event, data }) => {
  io.to(playerId).emit(event, data);
};

const suffleCards = (roomId) => {
  const game = ROOMS.find((room) => room.id === roomId);
  if (!game) {
    console.log("Room doesn't exist", roomId);
    return;
  }
  const { players } = game;
  if (players.length < 6) {
    console.log('We need 6 at least players', roomId);
    return;
  }
  // We need to have one card for each player, the only one that
  // repeats is the citizen
  const citizensToFill = new Array(players.length - 5).fill('CITIZEN');
  const cardsToDeliver = shuffle([...CARDS, ...citizensToFill]);
  console.log('shuffled', cardsToDeliver);
  for (let i = 0; i < players.length; i++) {
    let player = players[i];
    let card = cardsToDeliver.shift();
    sendMessageToPlayer({ playerId: player.id, event: 'newCard', data: card });
  }
};

const joinGame = (socket, id) => {
  const game = ROOMS.find((room) => room.id === id);

  if (!game) {
    console.log("Room doesn't exist", id);
    return;
  }

  // only add to the game if it exists
  const alreadyExistInGame = game.players.find(
    (player) => player.id === socket.id
  );

  if (!alreadyExistInGame) {
    console.log('a user joined a game: ', game.id);
    socket.join(game.id);
    const newPlayer = {
      id: socket.id,
      name: `user-${socket.id}`,
    };
    game.players.push(newPlayer);

    // Update members about the new joiner
    sendMessageToAllMembers({
      roomId: game.id,
      event: 'currentPlayers',
      data: game.players,
    });
    sendMessageToPlayer({
      playerId: newPlayer.id,
      event: 'currentPlayers',
      data: game.players,
    });
  }
};

const onConnection = (socket) => {
  console.log('a user connected');
  socket.on('join', (gameId) => joinGame(socket, gameId));
  socket.on('shuffle', (roomId) => suffleCards(roomId));

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected');

    // remove this player from our players object
    // TODO: clean this ugliness
    for (let i = 0; i < ROOMS.length; i++) {
      const room = ROOMS[i];
      const players = room.players;
      const playerIndex = players.findIndex(
        (player) => player.id === socket.id
      );
      if (playerIndex > -1) {
        players.splice(playerIndex, 1);
        ROOMS[i] = { id: room.id, players: [...players] };
        sendMessageToAllMembers({
          roomId: room.id,
          event: 'currentPlayers',
          data: players,
        });
      }
    }
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });
};

io.on('connection', onConnection);

server.listen(port, () => console.log(`Listening on port ${port}`));
