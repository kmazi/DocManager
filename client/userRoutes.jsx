import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ViewDocument from './components/container/ViewDocument';
import UserView from './components/UserView';
import AllUsersView from './components/AllUsersView';
import WriteDocument from './components/container/WriteDocument';
import ReadDocument from './components/ReadDocument';

export default (
  <Switch>
    <Route exact path="/user/documents" component={ViewDocument} />
    <Route path="/user/documents/createdocument" component={WriteDocument} />
    <Route path="/user/documents/users/all" component={AllUsersView} />
    <Route path="/user/documents/users" component={UserView} />
    <Route path="/user/documents/read" component={ReadDocument} />
  </Switch>
);
