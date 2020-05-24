import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../providers/SocketProvider';
import generateRandomString from '../helpers/generateRandomString';
import {
  Header,
  Button,
  JoinGame,
  Main,
  Container,
  Input,
  Form,
  FloatingTitleRight,
  FloatingTitleLeft,
  Paragraph,
} from './StyledComponents';

const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const Game = () => {
  const { socket, registerEvents } = useSocket();
  const query = useQuery();
  const gameRoom = query.get('id');
  const [currentPlayers, setCurrentPlayers] = React.useState([]);
  const [card, setCard] = React.useState(null);
  const [alreadyJoined, setAlreadyJoined] = React.useState(false);
  const [name, setName] = React.useState(() => {
    return localStorage.getItem('name') || '';
  });
  const userId = localStorage.getItem('userId') || generateRandomString(5);

  React.useEffect(() => {
    // Avoid joining until it chooses a name
    if (!socket || alreadyJoined || !name) return;

    registerEvents([
      ['currentPlayers', setCurrentPlayers],
      ['newCard', setCard],
    ]);
    localStorage.setItem('userId', userId);
    socket.emit('join', { gameRoom, userId, name });
    setAlreadyJoined(true);
  }, [socket, registerEvents, gameRoom, alreadyJoined, userId, name]);

  const shuffle = () => socket.emit('shuffle', gameRoom);
  const canPlay = currentPlayers.length > 5;

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target[0].value;
    setName(name);
    localStorage.setItem('name', name);
    socket.emit('updatedName', { userId, name });
  };

  return (
    <>
      <Header>
        <FloatingTitleRight>{gameRoom}</FloatingTitleRight>
        <FloatingTitleLeft>Players: {currentPlayers.length}</FloatingTitleLeft>
      </Header>
      <Main>
        {!name && (
          <Container>
            <Form onSubmit={handleSubmit}>
              <Input
                id="name"
                placeholder="What's your name?"
                name="id"
                type="text"
              />
              <JoinGame type="submit">Choose</JoinGame>
            </Form>
          </Container>
        )}
        <ul>
          {currentPlayers.map((player) => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
        {card && <p>You got the {card} card</p>}

        {card === 'GOD' && (
          <Button onClick={shuffle} disabled={!canPlay}>
            Shuffle {!canPlay ? '(We need at least 6 players 😬)' : ''}
          </Button>
        )}
      </Main>
    </>
  );
};

export default Game;
