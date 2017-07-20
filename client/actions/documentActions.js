import axios from 'axios';
import * as types from './types';

/**
 * Starts creating documents
 * @returns {object} returns the type of data it dispatches
 */
export const startCreatingDocument = () => ({
  type: types.START_CREATING_DOCUMENT,
});
/**
 * Fires when a document was just created
 * @param {object} documents - An array of documents from api
 * @returns {object} returns the type of data it dispatches
 */
export const doneCreatingDocument = status => ({
  type: types.DONE_CREATING_DOCUMENT,
  status
});
/**
 * Fires when there where errors creating a document
 * @param {object} error - An array of server errors after API calls
 * @returns {object} returns the error it dispatches
 */
export const errorCreatingDocument = error => ({
  type: types.ERROR_CREATING_DOCUMENT,
  error
});
/**
 * Starts creating documents
 * @param {object} documents - An array of documents from api
 * @returns {object} returns the type of data it dispatches
 */
export const startGetUserDocuments = () => ({
  type: types.START_GET_USER_DOCUMENT,
});

export const completeGetUserDocuments = documents => ({
  type: types.SUCCESS_GET_USER_DOCUMENT,
  documents,
});

export const errorGetUserDocuments = error => ({
  type: types.ERROR_GET_USER_DOCUMENT,
  error,
});

export const fetchPublicDocuments = () => ({
  type: types.START_FETCHING_PUBLIC_DOCUMENTS,
});

export const fetchRoleDocuments = () => ({
  type: types.START_FETCHING_ROLE_DOCUMENTS,
});

export const fetchAllDocuments = () => ({
  type: types.START_FETCHING_ALL_DOCUMENTS,
});

export const getUserDocuments = (id, token) => dispatch =>
  axios.get(`/api/v1/users/${id}/documents?token=${token}`)
  .then((response) => {
    dispatch(completeGetUserDocuments(response.data.documents));
  }, ({ response }) => {
    dispatch(errorGetUserDocuments(response.data));
  });

export const documentCreation = formValue => (dispatch) => {
  dispatch(startCreatingDocument());
  return axios.post('/api/v1/documents', formValue)
    .then((response) => {
      dispatch(doneCreatingDocument(response.data.status));
    },
     ({ response }) =>
      dispatch(errorCreatingDocument(response.data))
    );
};

export const publicDocuments = () => (dispatch) => {
  dispatch(fetchPublicDocuments());
};

export const roleDocuments = () => (dispatch) => {
  dispatch(fetchRoleDocuments());
};

export const allDocuments = () => (dispatch) => {
  dispatch(fetchAllDocuments());
};
