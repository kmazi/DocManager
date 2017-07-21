import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import App from '../components/App';
/**
 * The entry point of the redux application
 * @param {object} store - It contains the state of the application
 * @return {oject} The entire html to render to the browser
 */
export default function Root({ store, history }) {
  return (
    <Provider store={store}>
      <div>
        <ConnectedRouter history={history}>
          <Route path="/" component={App} />
        </ConnectedRouter>
      </div>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
