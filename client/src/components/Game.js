import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../providers/SocketProvider';
import generateRandomString from '../helpers/generateRandomString';
import {
  Header,
  Button,
  ShuffleButton,
  JoinGame,
  Main,
  Container,
  UnorderedList,
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

const Card = ({ type }) => {
  const MAP = {
    GOD: 'god.png',
    POLICE: 'police.png',
    THIEF: 'thief.png',
    DOCTOR: 'doctor.png',
    CITIZEN: `citizen_${Math.floor(Math.random() * 3 + 1)}.png`,
  };

  return <img src={`/cards/${MAP[type]}`} />;
};
const Game = () => {
  const { socket, registerEvents } = useSocket();
  const query = useQuery();
  const gameRoom = query.get('id');
  // only the one who created the game
  // can shuffle the cards
  const type = query.get('type');
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
        <FloatingTitleLeft>Count: {currentPlayers.length}</FloatingTitleLeft>
      </Header>
      <Main>
        {!name ? (
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
        ) : (
          <ContentContainer>
            <div>
              <Title>Players</Title>
              <WhiteContainer>
                <UnorderedList>
                  {currentPlayers.map((player) => (
                    <li key={player.id}>{player.name}</li>
                  ))}
                </UnorderedList>
              </WhiteContainer>
            </div>
            {card && <Card type={card} />}
            {type === 'new' && (
              <ShuffleButton onClick={shuffle} disabled={!canPlay}>
                Deal cards{' '}
                {!canPlay && (
                  <span style={{ display: 'block' }}>{`(${
                    6 - currentPlayers.length
                  } players left)`}</span>
                )}
              </ShuffleButton>
            )}
          </ContentContainer>
        )}
      </Main>
    </>
  );
};
const Title = styled.h1`
  padding: 0 1em;
`;
const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100%;
  align-items: center;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const WhiteContainer = styled(Container)`
  background-color: #fff;
  border: 1px solid var(--default-color);
  width: 22rem;
  flex-direction: column;
  box-shadow: 3px 3px 0 var(--default-color);
`;

export default Game;
