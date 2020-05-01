import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Game from './Game';

const App = () => {
  return (
    <Switch>
      <Route path="/game">
        <Game />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};

export default App;
