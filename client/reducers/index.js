import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const SignIn = (state = {
  userId: 0,
  status: 'Sign In',
  userName: 'Guest',
  errors: [],
  userDocs: [],
}, action) => {
  switch (action.type) {
  case types.STARTSIGNIN:
    return Object.assign({}, state, {
      status: 'Sign In...',
    });
  case types.SUCCESSFULSIGNIN:
    return Object.assign({}, state, {
      userId: action.userDocs.userId,
      status: 'Sign In',
      userName: action.userDocs.userName,
      userDocs: action.userDocs.documents,
    });
  case types.FAILEDSIGNIN:
    return Object.assign({}, state, {
      userDocs: [],
      status: 'Sign In',
      errors: action.userDocs.message,
    });
  default:
    return state;
  }
};

const rootReducer = combineReducers({
  SignIn,
  routing
});

export default rootReducer;
