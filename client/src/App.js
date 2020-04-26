import React from 'react';
import { SocketContext } from './SocketProvider';

const App = () => {
  const { socket } = React.useContext(SocketContext);
  const [currentPlayers, setCurrentPlayers] = React.useState([]);
  const [card, setCard] = React.useState(null);

  React.useEffect(() => {
    if (!socket) return;

    socket.on('currentPlayers', (data) => {
      console.log(data);
      setCurrentPlayers(data);
    });
    socket.on('newPlayer', (data) => {
      console.log(data);
    });
    socket.on('newCard', (data) => {
      console.log(data);
      setCard(data);
    });
  }, [socket]);

  const shuffle = () => {
    socket.emit('shuffle');
  };

  return (
    <>
      <p>Current players count: {currentPlayers.length}</p>
      <ul>
        {currentPlayers.map((player) => (
          <li key={player.playerId}>{player.name}</li>
        ))}
      </ul>
      <button onClick={shuffle}>Shuffle</button>
      {card && <p>You got the {card} card</p>}
    </>
  );
};

export default App;
