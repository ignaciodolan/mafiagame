import React from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

const App = () => {
  const [currentPlayers, setCurrentPlayers] = React.useState([]);

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("currentPlayers", data => {
      console.log(data);
      setCurrentPlayers(data);
    });
    socket.on("newPlayer", data => {
      console.log(data);
    });
  }, []);

  return (
    <p>
      Current players count: {currentPlayers.length}
      <ul>
        {currentPlayers.map((player) => <li>{player.name}</li>)}
      </ul>
    </p>
  );
}

export default App;
