import React from 'react';
import { useLocation } from 'react-router-dom';
import { SocketContext } from './SocketProvider';

const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const Game = () => {
  const { socket, registerEvents } = React.useContext(SocketContext);
  const query = useQuery();
  const gameRoom = query.get('id');
  const [currentPlayers, setCurrentPlayers] = React.useState([]);
  const [card, setCard] = React.useState(null);
  const [alreadyJoined, setAlreadyJoined] = React.useState(false);

  React.useEffect(() => {
    if (!socket || alreadyJoined) return;

    registerEvents([
      ['currentPlayers', setCurrentPlayers],
      ['newCard', setCard],
    ]);
    socket.emit('join', gameRoom);
    setAlreadyJoined(true);
  }, [socket, registerEvents, gameRoom, alreadyJoined]);

  const shuffle = () => {
    socket.emit('shuffle', gameRoom);
  };

  const canPlay = currentPlayers.length > 4;
  return (
    <>
      <p>Current players count: {currentPlayers.length}</p>
      <ul>
        {currentPlayers.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <button onClick={shuffle} disabled={!canPlay}>
        Shuffle {!canPlay ? '(We need at least 5 players 😬)' : ''}
      </button>
      {card && <p>You got the {card} card</p>}
    </>
  );
};

export default Game;
