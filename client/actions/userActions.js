import axios from 'axios';
import * as types from './types';

/**
 * Dispatches an action when signin starts
 * @return {object} returns an object containing action type
 */
export const startSignInUser = () => ({
  type: types.START_SIGNIN,
});
/**
 * Dispatches an action when signin completes successfully
 * @param {object} userDetail - User information from signin process
 * @return {object} returns an object containing user details and action type
 */
export const finishSignInUser = userDetail => ({
  type: types.SUCCESSFUL_SIGNIN,
  userDetail,
});
/**
 * Dispatches an action when signin error occurs
 * @param {object} errors - Errors from signin process
 * @return {object} returns an object containing errors and action type
 */
export const errorSignInUser = errors => ({
  type: types.FAILED_SIGNIN,
  errors,
});
/**
 * Dispatches an action when getting user role
 * @param {object} userRole - Role the current user belongs to
 * @return {object} returns an object containing user role and action type
 */
export const setUserRole = userRole => ({
  type: types.SET_USER_ROLE,
  userRole,
});
/**
 * Dispatches an action to sign in a user
 * @param {object} user - Form data to send to the server
 * @return {func} returns a function that will be executed to signin a user
 */
export const signInUser = user => (dispatch) => {
  dispatch(startSignInUser());
  return axios.post('/api/v1/users/login', user)
    .then((response) => {
      localStorage.setItem('docmanagertoken', response.data.token);
      dispatch(setUserRole(response.data.roleType));
      dispatch(finishSignInUser(response.data));
      return response.data;
    },
    ({ response }) => {
      dispatch(errorSignInUser(response.data.message));
      return response.data;
    }
    );
};
/**
 * Dispatches an action when signin starts
 * @return {object} returns an object containing action type
 */
export const startSignUpUser = () => ({
  type: types.START_SIGNUP,
});
/**
 * Dispatches an action when signup completes successfully
 * @param {object} userDetail - User information from signup process
 * @return {object} returns an object containing user details and action type
 */
export const finishSignUpUser = userDetail => ({
  type: types.SUCCESSFUL_SIGNUP,
  userDetail,
});
/**
 * Dispatches an action when signup error occurs
 * @param {object} errors - Errors from signin process
 * @return {object} returns an object containing errors and action type
 */
export const errorSignUpUser = errors => ({
  type: types.FAILED_SIGNUP,
  errors,
});

/**
 * Dispatches an action to sign in a user
 * @param {object} user - Form data to send to the server
 * @return {func} returns a function that will be executed to signin a user
 */
export const signUserUp = user => (dispatch) => {
  dispatch(setUserRole(user.roleValue));
  dispatch(startSignUpUser());
  return axios.post('/api/v1/users', user)
    .then((response) => {
      localStorage.setItem('docmanagertoken', response.data.token);
      dispatch(finishSignUpUser(response.data));
      return response.data;
    },
    ({ response }) => {
      dispatch(errorSignUpUser(response.data.message));
      return response.data;
    });
};
/**
 * Dispatches an action that indicates that the system is fetching users
 * @return {object} returns an object containing
 * details about the dispatched action
 */
export const startGettingUsers = () => ({
  type: types.START_GETTING_ALL_USERS,
});
/**
 * Dispatches an action that indicates that the system has fetched all users
 * @param {object} users - The array of users from the database
 * @return {object} returns an object containing
 * details about the dispatched action
 */
export const finishGettingUsers = (users, responseStatus) => ({
  type: types.FINISH_GETTING_ALL_USERS,
  users,
  responseStatus,
});
/**
 * Dispatches an action that indicates that the system is fetching users
 * @param {string} error - The error message
 * @return {object} returns an object containing
 * details about the dispatched action
 */
export const errorGettingUsers = (error, responseStatus) => ({
  type: types.ERROR_GETTING_ALL_USERS,
  error,
  responseStatus,
});
/**
 * Dispatches an action to get all users
 * @param {object} token - user token for identification
 * @return {func} returns a function that will be executed to signin a user
 */
export const fetchAllUsers = token => (dispatch) => {
  dispatch(startGettingUsers());
  return axios.get(`/api/v1/users?token=${token}`)
    .then((response) => {
      dispatch(finishGettingUsers(response.data.users, response.data.status));
    },
    ({ response }) => {
      dispatch(errorGettingUsers(response.data.message, response.data.status));
    });
};
export const updatingUser = () => ({
  type: types.START_UPDATING_USER,
});
export const doneUpdatingUser = status => ({
  type: types.DONE_UPDATING_USER,
  status,
});
export const errorUpdatingUser = error => ({
  type: types.ERROR_UPDATING_USER,
  error,
});
export const editUserDetail = (userDetail, userId, token) => (dispatch) => {
  dispatch(updatingUser());
  return axios.put(`/api/v1/users/${userId}?token=${token}`, userDetail)
    .then((response) => {
      dispatch(doneUpdatingUser(response.data.status));
    },
    ({ response }) => {
      dispatch(errorUpdatingUser(response.data.status, response.data.message));
    });
};
export const setEmailInputValue = inputValue => ({
  type: types.UPDATE_EMAIL,
  email: inputValue,
});
export const changeInputValue = inputValue => (dispatch) => {
  dispatch(setEmailInputValue(inputValue));
};
