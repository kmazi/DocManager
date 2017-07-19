import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const signIn = (state = {
  userId: 0,
  status: 'Sign In',
  userName: 'Guest',
  errors: ''
}, action) => {
  switch (action.type) {
  case types.STARTSIGNIN:
    return Object.assign({}, state, {
      status: 'Sign In...',
    });
  case types.SUCCESSFULSIGNIN:
    return Object.assign({}, state, {
      status: 'Sign In',
      userName: action.userDetail.userName,
      userId: action.userDetail.userId,
    });
  case types.FAILEDSIGNIN:
    return Object.assign({}, state, {
      documents: [],
      status: 'Sign In',
      errors: action.errors.message[0],
    });
  default:
    return state;
  }
};

const signUp = (state = {
  userId: 0,
  status: 'Sign Up',
  userName: 'Guest',
  errors: ''
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
  display: false,
  status: 'loading documents...',
  documents: [],
}, action) => {
  switch (action.type) {
  case types.STARTGETUSERDOCUMENT:
    return Object.assign({}, state, {
      display: false,
    });
  case types.SUCCESSGETUSERDOCUMENT:
    return Object.assign({}, state, {
      display: true,
      documents: action.documents,
    });
  case types.ERRORGETUSERDOCUMENT:
    return Object.assign({}, state, {
      status: action.error,
      display: false,
    });
  default:
    return state;
  }
};

const rootReducer = combineReducers({
  signIn,
  signUp,
  fetchDocuments,
  routing
});

export default rootReducer;
