import React from 'react';
import { render } from 'react-dom';
import { persistStore } from 'redux-persist';
import localForage from 'localforage';
import { configureStore, history } from './store/configureStore';
import Root from './Root';

const store = configureStore();
// this line of code is somehow problematic
persistStore(store, { storage: localForage });
// renders the application on the browser
render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
