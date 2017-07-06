import * as types from './types';

export const signInUser = user => ({
  type: types.SIGNUP,
  user,
});

export const signUpUSer = user => ({
  type: types.SIGNIN,
  user,
});
