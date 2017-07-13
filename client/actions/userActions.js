import $ from 'jquery';
import axios from 'axios';
import * as types from './types';

export const startSignInUser = () => ({
  type: types.STARTSIGNIN,
});

export const finishSignInUser = userDetail => ({
  type: types.SUCCESSFULSIGNIN,
  userDetail,
});

export const errorSignInUser = errors => ({
  type: types.FAILEDSIGNIN,
  errors,
});

// export const signInUser = user => (dispatch) => {
//   // Notify the user that signin process has started
//   dispatch(startSignInUser());
//   // make api calls via jquery ajax
//   $.ajax('/api/v1/users/signin', {
//     data: user,
//     dataType: 'json',
//     success: (userDetail) => {
//       if (userDetail.status === 'successful') {
//         dispatch(finishSignInUser(userDetail));
//         localStorage.setItem('doctoken', userDetail.token);
//       }
//       if (userDetail.status === 'unsuccessful') {
//         dispatch(finishSignInUser(userDetail));
//       }
//     },
//     error: (jqXHR, status) => {
//       dispatch(errorSignInUser(status));
//     }
//   });
// };

export const signInUser = user => (
  dispatch => (
    axios.post('/api/v1/users/login', user)
  ).then((response) => {
    console.log(response);
    dispatch(finishSignInUser(response.data));
    localStorage.setItem('doctoken', response.data.token);
  },
({ response }) => {
  console.log('error', response);
  dispatch(errorSignInUser(response.data));
  return true;
})
);

export const signUpUSer = () => ({
  type: types.SIGNUP,
});
