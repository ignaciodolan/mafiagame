import React from 'react';
import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://127.0.0.1:4001';

const App = () => {
  const [socket, setSocket] = React.useState(null);
  const [currentPlayers, setCurrentPlayers] = React.useState([]);
  const [card, setCard] = React.useState(null);

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
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
  }, []);

  React.useEffect(() => {}, [currentPlayers]);

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
