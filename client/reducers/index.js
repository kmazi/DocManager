import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as types from '../actions/types';

const authenticateUser = (state = {
  userId: 0,
  updateStatus: 'Update Profile',
  disabled: true,
  signInStatus: 'Sign In',
  signUpStatus: 'Sign Up',
  signUpDate: '',
  userName: 'Guest',
  userEmail: '',
  updateEmail: '',
  errors: [],
  roleType: 'None',
  status: 'unsuccessful',
}, action) => {
  switch (action.type) {
  case types.START_UPDATING_USER:
    return Object.assign({}, state, {
      updateStatus: 'Updating...',
    });
  case types.UPDATE_EMAIL:
    return Object.assign({}, state, {
      updateEmail: action.email,
    });
  case types.DONE_UPDATING_USER:
    return Object.assign({}, state, {
      updateStatus: 'Update Profile',
    });
  case types.ERROR_UPDATING_USER:
    return Object.assign({}, state, {
      updateStatus: 'Updating Profile',
    });
  case types.START_SIGNUP:
    return Object.assign({}, state, {
      signUpStatus: 'Signing Up...',
    });
  case types.SUCCESSFUL_SIGNUP:
    return Object.assign({}, state, {
      signUpStatus: 'Sign Up',
      userName: action.userDetail.userName || 'Guest',
      userId: action.userDetail.userId || 0,
      userEmail: action.userDetail.email,
      updateEmail: action.userDetail.email,
      roleType: action.userDetail.roleType,
      createdAt: action.userDetail.createdAt,
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
  case types.SET_USER_ROLE:
    return Object.assign({}, state, {
      roleType: action.userRole,
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
      userEmail: action.userDetail.email,
      updateEmail: action.userDetail.email,
      createdAt: action.userDetail.createdAt,
      roleType: action.userDetail.roleType,
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

const readDocument = (state = {
  status: 0,
  delStatus: 0,
  error: '',
  message: '',
  document: {},
}, action) => {
  switch (action.type) {
  case types.START_READING_DOCUMENT:
    return Object.assign({}, state, {
      status: action.docId,
      document: '',
    });
  case types.DONE_READING_DOCUMENT:
    return Object.assign({}, state, {
      status: 0,
      document: action.document,
    });
  case types.ERROR_READING_DOCUMENT:
    return Object.assign({}, state, {
      status: 0,
      document: {},
      error: action.error
    });
  case types.START_DELETING_DOCUMENT:
    return Object.assign({}, state, {
      delStatus: action.docId,
      message: '',
    });
  case types.DONE_DELETING_DOCUMENT:
    return Object.assign({}, state, {
      delStatus: 0,
      message: action.message,
    });
  case types.ERROR_DELETING_DOCUMENT:
    return Object.assign({}, state, {
      delStatus: 0,
      error: action.error
    });
  default:
    return state;
  }
};

const fetchDocuments = (state = {
  isReady: false,
  status: 'Loading my documents...',
  documents: [],
  documentType: '',
  documentCounter: 0,
  currentPage: 1,
  documentaccess: 'Private',
}, action) => {
  switch (action.type) {
  case types.DONE_SEARCHING_DOCUMENTS:
    return Object.assign({}, state, {
      documents: action.documents,
      isReady: true,
      documentaccess: '',
      currentPage: action.pageNumber,
      documentCounter: action.count,
    });
  case types.ERROR_SEARCHING_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.error,
      isReady: false,
      documentCounter: 0,
    });
  case types.START_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      isReady: false,
      documents: [],
      status: 'Loading my documents...',
    });
  case types.SUCCESS_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      isReady: true,
      documentType: 'Private',
      documents: action.documents,
    });
  case types.ERROR_GET_USER_DOCUMENT:
    return Object.assign({}, state, {
      status: action.error.message,
      isReady: false,
      documentCounter: 0,
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
      documentType: 'Public',
      documents: action.documents,
    });

  case types.ERROR_FETCHING_PUBLIC_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.error,
      isReady: false,
      documents: [],
      documentCounter: 0,
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
      documentType: 'All',
      documents: action.documents,
    });

  case types.ERROR_FETCHING_ALL_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.error,
      documents: [],
      isReady: false,
      documentCounter: 0,
    });

  case types.START_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      status: action.roleType,
      isReady: false,
      documents: [],
    });

  case types.DONE_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: true,
      documentType: 'Role',
      documents: action.documents,
    });

  case types.ERROR_FETCHING_ROLE_DOCUMENTS:
    return Object.assign({}, state, {
      isReady: false,
      documents: [],
      status: action.error,
      documentCounter: 0,
    });
  default:
    return state;
  }
};

const fetchAllUsers = (state = {
  status: '',
  responseStatus: '',
  users: [],
}, action) => {
  switch (action.type) {
  case types.START_GETTING_ALL_USERS:
    return Object.assign({}, state, {
      status: 'Fetching all users...',
      responseStatus: '',
    });
  case types.ERROR_GETTING_ALL_USERS:
    return Object.assign({}, state, {
      status: action.error,
      responseStatus: action.responseStatus,
    });
  case types.FINISH_GETTING_ALL_USERS:
    return Object.assign({}, state, {
      users: action.users,
      status: '',
      responseStatus: action.responseStatus,
    });
  default:
    return state;
  }
};

const rootReducer = combineReducers({
  authenticateUser,
  createDoc,
  fetchDocuments,
  readDocument,
  fetchAllUsers,
  routing
});

export default rootReducer;
