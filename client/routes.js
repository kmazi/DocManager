import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home.jsx';
import UserDocuments from './components/UserDocuments.jsx';

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/docs" component={UserDocuments} />
  </Switch>
);
