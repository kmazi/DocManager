import axios from 'axios';
import * as types from './types';

export const startCreatingDocument = () => {

};

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

export const getUserDocuments = (id, token) => (dispatch) => {
  dispatch(startGetUserDocuments());
  return axios.get(`/api/v1/users/${id}/documents?token=${token}`)
  .then((documents) => {
    dispatch(completeGetUserDocuments(documents.data.documents));
  }, (errors) => {
    dispatch(errorGetUserDocuments(errors.data));
  });
};

export const documentCreation = () => dispatch => {
  dispatch(startCreatingDocument());
};
