import axios from 'axios';
import * as types from './types';

export const startCreatingDocument = () => ({
  type: types.STARTCREATINGDOCUMENT,
});

export const startGetUserDocuments = () => ({
  type: types.STARTGETUSERDOCUMENT,
});

export const completeGetUserDocuments = documents => ({
  type: types.SUCCESSGETUSERDOCUMENT,
  documents,
});

export const errorGetUserDocuments = error => ({
  type: types.ERRORGETUSERDOCUMENT,
  error,
});

export const getUserDocuments = (id, token) => dispatch =>
  axios.get(`/api/v1/users/${id}/documents?token=${token}`)
  .then((response) => {
    dispatch(completeGetUserDocuments(response.data.documents));
  }, ({ response }) => {
    dispatch(errorGetUserDocuments(response.data));
  });

export const documentCreation = () => (dispatch) => {
  dispatch(startCreatingDocument());
};
