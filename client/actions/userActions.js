import * as types from './types';

export const startSignInUser = () => ({
  type: types.SIGNIN,
});

export const signInUser = user => ({
  type: types.SUCCESSFULSIGNIN,
  user
});

export const doneSignInUser = documents => ({
  type: types.SUCCESSFULSIGNIN,
  documents,
});

export const errorSignInUser = errors => ({
  type: types.FAILEDSIGNIN,
  errors,
});

export const signUpUSer = () => ({
  type: types.SIGNUP,
});
