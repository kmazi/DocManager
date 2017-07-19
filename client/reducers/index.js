import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const authenticateUser = (state = {
  userId: 0,
  status: 'Sign In',
  userName: 'Guest',
  errors: '',
  isAuthenticated: false,
}, action) => {
  switch (action.type) {
  case types.STARTSIGNIN:
    return Object.assign({}, state, {
      status: 'Signing In...',
    });
  case types.SUCCESSFULSIGNIN:
    return Object.assign({}, state, {
      status: 'Sign In',
      userName: action.userDetail.userName || 'Guest',
      userId: action.userDetail.userId || 0,
      isAuthenticated: true,
    });
  case types.FAILEDSIGNIN:
    return Object.assign({}, state, {
      documents: [],
      status: 'Sign In',
      errors: action.errors,
      isAuthenticated: false,
    });
  default:
    return state;
  }
};

const signUp = (state = {
  userId: 0,
  status: 'Sign Up',
  userName: 'Guest',
  errors: [],
}, action) => {
  switch (action) {
  case types.STARTSIGNUP:
    return Object.assign({}, state, {
      status: 'Signing Up...',
    });
  case types.SUCCESSFULSIGNUP:
    return Object.assign({}, state, {
      status: 'Sign Up',
      userName: action.userDetail.userName,
      userId: action.userDetail.userId,
      errors: [],
    });
  case types.FAILEDSIGNUP:
    return Object.assign({}, state, {
      documents: [],
      status: 'Sign Up',
      errors: action.errors.message[0],
    });
  default:
    return state;
  }
};

const fetchDocuments = (state = {
  isReady: false,
  status: 'Loading documents...',
  documents: [],
}, action) => {
  switch (action.type) {
  case types.STARTGETUSERDOCUMENT:
    return Object.assign({}, state, {
      isReady: false,
    });
  case types.SUCCESSGETUSERDOCUMENT:
    return Object.assign({}, state, {
      isReady: true,
      documents: action.documents,
    });
  case types.ERRORGETUSERDOCUMENT:
    return Object.assign({}, state, {
      status: action.error.message,
      isReady: false,
    });
  default:
    return state;
  }
};

const rootReducer = combineReducers({
  authenticateUser,
  signUp,
  fetchDocuments,
  routing
});

export default rootReducer;
