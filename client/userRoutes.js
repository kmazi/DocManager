import React from 'react';
import { Route, Switch } from 'react-router-dom';
import DocumentView from './components/DocumentView.jsx';
import UserView from './components/UserView.jsx';
import CreateDocument from './components/CreateDocument.jsx';

export default (
  <Switch>
    <Route exact path="/user/documents" component={DocumentView} />
    <Route path="/user/documents/createdocument" component={CreateDocument} />
    <Route path="/user/documents/users" component={UserView} />
  </Switch>
);
