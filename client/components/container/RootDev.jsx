import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import App from '../presentation/App';
import DevTools from '../presentation/DevTools';
/**
 * The entry point of the redux application
 * @param {object} store - It contains the state of the application
 * @return {oject} The entire html to render to the browser
 */
const Root = ({ store, history }) => (
  <Provider store={store}>
    <div>
      <ConnectedRouter history={history}>
        <Route path="/" component={App} />
      </ConnectedRouter>
      <DevTools />
    </div>
  </Provider>
);

export default Root;

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
