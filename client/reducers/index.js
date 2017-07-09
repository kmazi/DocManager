import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const beforeSignIn = (state = 'Sign In', action) => {
  switch (action.type) {
  case types.SIGNIN:
    return 'Sign In ...';
  default:
    return state;
  }
};


const rootReducer = combineReducers({
  beforeSignIn,
  routing
});

export default rootReducer;
