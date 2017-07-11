import $ from 'jquery';
import * as types from './types';

export const startSignInUser = () => ({
  type: types.STARTSIGNIN,
});

export const finishSignInUser = userDocs => ({
  type: types.SUCCESSFULSIGNIN,
  userDocs,
});

export const errorSignInUser = errors => ({
  type: types.FAILEDSIGNIN,
  errors,
});

export const signInUser = user => (dispatch) => {
  // Notify the user that signin process has started
  dispatch(startSignInUser());
  // make api calls via jquery ajax
  $.ajax('/users', {
    data: user,
    dataType: 'json',
    success: (userDocs) => {
      if (userDocs.status === 'successful') {
        dispatch(finishSignInUser(userDocs));
      }
      if (userDocs.status === 'unsuccessful') {
        dispatch(finishSignInUser(userDocs));
      }
    },
    error: (jqXHR, status) => {
      dispatch(errorSignInUser(status));
    }
  });
};

export const signUpUSer = () => ({
  type: types.SIGNUP,
});
