const shuffle = require('./helpers/shuffle');

const CARDS = ['POLICE', 'DOCTOR', 'GOD', 'THIEF', 'CITIZEN'];
const ROOMS = [{ id: '6gEmrsD3', players: [] }];
const MINIMUM_AMOUNT_PLAYERS = 6;

const setupGame = (io, socket) => {
  const sendMessageToAllMembers = ({ roomId, event, data }) => {
    const gameSocket = io.sockets.in(roomId);
    gameSocket.emit(event, data);
  };

  const sendMessageToPlayer = ({ playerId, event, data }) => {
    io.to(playerId).emit(event, data);
  };

  const dealCards = (roomId) => {
    const game = ROOMS.find((room) => room.id === roomId);
    if (!game) {
      console.log("Room doesn't exist", roomId);
      return;
    }
    const { players } = game;
    if (players.length < MINIMUM_AMOUNT_PLAYERS) {
      console.log(`We need at ${MINIMUM_AMOUNT_PLAYERS} least players`, roomId);
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
      sendMessageToPlayer({
        playerId: player.id,
        event: 'newCard',
        data: card,
      });
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

  const removeUserFromGameRoom = () => {
    console.log('user disconnected');
    // TODO: clean this ugliness
    // remove this player from our players object
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
  };

  console.log('a user connected');
  socket.on('join', (gameId) => joinGame(socket, gameId));
  socket.on('shuffle', (roomId) => dealCards(roomId));
  socket.on('disconnect', removeUserFromGameRoom);
};

module.exports = setupGame;
