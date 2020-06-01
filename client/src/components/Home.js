import React from 'react';
import generateRandomString from '../helpers/generateRandomString';
import {
  Header,
  Section,
  Form,
  JoinGame,
  CreateGame,
  Main,
  Container,
  Input,
  RightImage,
  LeftImage,
  ArrowRight,
  FloatingTitleRight,
  Paragraph,
} from './StyledComponents';

const Home = () => {
  return (
    <>
      <Header>
        <FloatingTitleRight>Mafia Game</FloatingTitleRight>
      </Header>
      <Main>
        <Section>
          <LeftImage src="/police-head.svg" alt="police head" />
          <RightImage src="/nurse-head.svg" alt="nurse head" />
          <Container>
            <Form method="GET" action="/game">
              <Input
                id="gameId"
                placeholder="Join a game!"
                name="id"
                type="text"
              />
              <JoinGame type="submit">Join</JoinGame>
            </Form>
            <ArrowRight src="/arrow-right.svg" alt="arrow right" />
          </Container>
          <Paragraph>OR</Paragraph>
          <Container>
            <form method="GET" action="/game">
              <input
                id="gameId"
                name="id"
                type="hidden"
                value={generateRandomString()}
              />
              <input name="type" type="hidden" value="new" />
              <CreateGame type="submit">Create a game</CreateGame>
            </form>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default Home;
