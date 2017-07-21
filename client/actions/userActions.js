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
 * Dispatches an action to sign in a user
 * @param {object} user - Form data to send to the server
 * @return {func} returns a function that will be executed to signin a user
 */
export const signInUser = user => (dispatch) => {
  dispatch(startSignInUser());
  return axios.post('/api/v1/users/login', user)
    .then((response) => {
      localStorage.setItem('docmanagertoken', response.data.token);
      dispatch(finishSignInUser(response.data));
    },
     ({ response }) =>
      dispatch(errorSignInUser(response.data.message))
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
  dispatch(startSignUpUser());
  return axios.post('/api/v1/users', user)
    .then((response) => {
      localStorage.setItem('docmanagertoken', response.data.token);
      dispatch(finishSignUpUser(response.data));
    },
    ({ response }) => {
      dispatch(errorSignUpUser(response.data.message));
    });
};
