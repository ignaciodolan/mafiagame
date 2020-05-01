import React from 'react';
import generateRandomString from './helpers/generateRandomString';

const Home = () => {
  return (
    <main>
      <h1>Welcome to Mafia</h1>
      <section>
        <p>Join a game!</p>
        <form method="GET" action="/game">
          <input id="gameId" name="id" type="text" />
          <button type="submit">Join</button>
        </form>
        <p>Create a game</p>
        <form method="GET" action="/game">
          <input
            id="gameId"
            name="id"
            type="hidden"
            value={generateRandomString()}
          />
          <button type="submit">Create</button>
        </form>
      </section>
    </main>
  );
};

export default Home;
