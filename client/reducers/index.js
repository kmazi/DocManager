import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const authenticateUser = (state = {
  userId: 0,
  signInStatus: 'Sign In',
  signUpStatus: 'Sign Up',
  userName: 'Guest',
  errors: [],
  status: 'unsuccessful',
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
      status: 'successful',
      errors: [],
    });
  case types.FAILED_SIGNUP:
    return Object.assign({}, state, {
      documents: [],
      signUpStatus: 'Sign Up',
      errors: action.errors,
      status: 'unsuccessful',
    });

  case types.START_SIGNIN:
    return Object.assign({}, state, {
      signInStatus: 'Signing In...',
      status: 'unsuccessful',
    });
  case types.SUCCESSFUL_SIGNIN:
    return Object.assign({}, state, {
      signInStatus: 'Sign In',
      userName: action.userDetail.userName || 'Guest',
      userId: action.userDetail.userId || 0,
      status: 'successful',
      errors: [],
    });
  case types.FAILED_SIGNIN:
    return Object.assign({}, state, {
      documents: [],
      signInStatus: 'Sign In',
      errors: action.errors,
      status: 'unsuccessful',
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
  status: 'Loading my documents...',
  documents: [],
}, action) => {
  switch (action.type) {
  case types.START_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      isReady: false,
      documents: [],
      status: 'Loading my documents...',
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

  case types.START_FETCHING_PUBLIC_DOCUMENTS:
    return Object.assign({}, state, {
      status: 'Loading public documents...',
      isReady: false,
      documents: [],
    });

  case types.DONE_FETCHING_PUBLIC_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: true,
      documents: action.documents,
    });

  case types.ERROR_FETCHING_PUBLIC_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.error,
      isReady: false,
      documents: [],
    });

  case types.START_FETCHING_ALL_DOCUMENTS:
    return Object.assign({}, state, {
      status: 'Loading all documents...',
      isReady: false,
      documents: [],
    });

  case types.DONE_FETCHING_ALL_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: true,
      documents: action.documents,
    });

  case types.ERROR_FETCHING_ALL_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.error,
      documents: [],
      isReady: false,
    });

  case types.START_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      status: 'Loading role documents...',
      isReady: false,
      documents: [],
    });

  case types.DONE_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: true,
      documents: action.documents,
    });

  case types.ERROR_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: false,
      documents: [],
      status: action.error
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
