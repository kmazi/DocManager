import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DocumentView from './components/DocumentView';
import UserView from './components/UserView';
import CreateDocument from './components/CreateDocument';

export default (
  <Switch>
    <Route exact path="/user/documents" component={DocumentView} />
    <Route path="/user/documents/createdocument" component={CreateDocument} />
    <Route path="/user/documents/users" component={UserView} />
  </Switch>
);
