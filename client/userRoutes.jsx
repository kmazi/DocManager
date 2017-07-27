import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DocumentView from './components/presentation//DocumentView';
import UserView from './components/UserView';
import WriteDocument from './components/container/WriteDocument';
import CreateDocument from './components/presentation/CreateDocument';

export default (
  <Switch>
    <Route exact path="/user/documents" component={DocumentView} />
    <Route path="/user/documents/createdocument" component={WriteDocument} />
    <Route path="/user/documents/users" component={UserView} />
  </Switch>
);
