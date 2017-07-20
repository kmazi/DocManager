import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const authenticateUser = (state = {
  userId: 0,
  signInStatus: 'Sign In',
  signUpStatus: 'Sign Up',
  userName: 'Guest',
  errors: [],
  isAuthenticated: false,
}, action) => {
  switch (action.type) {
  case types.START_SIGNUP:
    return Object.assign({}, state, {
      signUpStatus: 'Signing Up...',
    });
  case types.SUCCESSFUL_SIGNUP:
    return Object.assign({}, state, {
      signUpStatus: 'Sign Up',
      userName: action.userDetail.userName || 'Guest',
      userId: action.userDetail.userId || 0,
      isAuthenticated: true,
      errors: [],
    });
  case types.FAILED_SIGNUP:
    return Object.assign({}, state, {
      documents: [],
      status: 'Sign Up',
      errors: action.errors,
    });
  case types.START_SIGNIN:
    return Object.assign({}, state, {
      signInStatus: 'Signing In...',
    });
  case types.SUCCESSFUL_SIGNIN:
    return Object.assign({}, state, {
      signInStatus: 'Sign In',
      userName: action.userDetail.userName || 'Guest',
      userId: action.userDetail.userId || 0,
      isAuthenticated: true,
    });
  case types.FAILED_SIGNIN:
    return Object.assign({}, state, {
      documents: [],
      signInStatus: 'Sign In',
      errors: action.errors,
      isAuthenticated: false,
    });
  default:
    return state;
  }
};

const createDoc = (state = {
  status: 'Unsuccessful',
  errors: [],
}, action) => {
  switch (action) {
  case types.START_CREATING_DOCUMENT:
    return Object.assign({}, state, {
      status: 'Creating document...',
    });
  case types.DONE_CREATING_DOCUMENT:
    return Object.assign({}, state, {
      status: 'Successful',
    });
  case types.ERROR_CREATING_DOCUMENT:
    return Object.assign({}, state, {
      status: 'Unsuccessful',
      errors: action.errors.message,
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
  case types.START_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      isReady: false,
    });
  case types.SUCCESS_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      isReady: true,
      documents: action.documents,
    });
  case types.ERROR_GET_USER_DOCUMENT:
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
  createDoc,
  fetchDocuments,
  routing
});

export default rootReducer;
