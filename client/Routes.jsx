import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from './components/presentation/Home';
import UserPage from './components/UserPage';

const PrivateRoute = ({ component: Component, redirectTo, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        return localStorage.getItem('docmanagertoken') ? (
          <Component {...routeProps} />
      ) : (
        <Redirect to={{
          pathname: redirectTo,
          state: { from: routeProps.location }
        }}
        />
      );
    }}
    />
  );
};

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <PrivateRoute path="/user/documents" redirectTo="/" component={UserPage} />
    <Route path="/user/documents" component={UserPage} />
  </Switch>
);
