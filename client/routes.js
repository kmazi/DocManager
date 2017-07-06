import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home.jsx';
import Authenticate from './containers/Authenticate.jsx';

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/signin" component={Authenticate} />
  </Switch>
);
