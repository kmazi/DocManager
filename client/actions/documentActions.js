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
 * @param {object} status - A string indicating the stage
 * of the document creation process
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
export const documentCreation = formValue => (dispatch) => {
  dispatch(startCreatingDocument());
  return axios.post('/api/v1/documents', formValue)
    .then((response) => {
      dispatch(doneCreatingDocument(response.data.status));
      return response.data;
    },
    ({ response }) => {
      dispatch(errorCreatingDocument(response.data));
      return response.data;
    }
    );
};
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
});// done fetching own documents
/**
 *
 * @param {number} id - The user ID used to fetch documents
 * @param {string} token - The authentication token
 * @return {object} Returns an object response from the server
 */
export const getUserDocuments = (id, token) => (dispatch) => {
  dispatch(startGetUserDocuments());
  return axios.get(`/api/v1/users/${id}/documents?token=${token}`)
    .then((response) => {
      dispatch(completeGetUserDocuments(response.data.documents));
      return response.data.status;
    }, ({ response }) => {
      dispatch(errorGetUserDocuments(response.data));
      return response.data.status;
    });
};

// fetching public document
export const fetchingPublicDocuments = () => ({
  type: types.START_FETCHING_PUBLIC_DOCUMENTS,
});

export const fetchingPublicDocumentsComplete = documents => ({
  type: types.DONE_FETCHING_PUBLIC_DOCUMENTS,
  documents,
});

export const fetchingPublicDocumentsFailed = error => ({
  type: types.ERROR_FETCHING_PUBLIC_DOCUMENTS,
  error,
}); // done fetching public document

export const publicDocuments = token => (dispatch) => {
  dispatch(fetchingPublicDocuments());
  return axios.get(`/api/v1/Public/documents?token=${token}`)
    .then((response) => {
      dispatch(fetchingPublicDocumentsComplete(response.data.documents));
    },
    ({ response }) => {
      dispatch(fetchingPublicDocumentsFailed(response.data.message));
    });
};

// start fetching role documents
export const fetchRoleDocuments = roleType => ({
  type: types.START_FETCHING_ROLE_DOCUMENTS,
  roleType: roleType || 'Loading...',
});

export const fetchRoleDocumentsComplete = documents => ({
  type: types.DONE_FETCHING_ROLE_DOCUMENTS,
  documents,
});

export const fetchRoleDocumentsFailed = error => ({
  type: types.ERROR_FETCHING_ROLE_DOCUMENTS,
  error,
});
// done fetching role documents
export const roleDocuments = (token, roleType) => (dispatch) => {
  dispatch(fetchRoleDocuments());
  return axios.get(`/api/v1/${roleType}/documents?token=${token}`)
  .then((response) => {
    dispatch(fetchRoleDocumentsComplete(response.data.documents));
  },
    ({ response }) => {
      dispatch(fetchRoleDocumentsFailed(response.data.message));
    });
};

// start fetching all documents
export const fetchAllDocuments = () => ({
  type: types.START_FETCHING_ALL_DOCUMENTS,
});

export const fetchAllDocumentsComplete = documents => ({
  type: types.DONE_FETCHING_ALL_DOCUMENTS,
  documents,
});

export const fetchAllDocumentsFailed = error => ({
  type: types.ERROR_FETCHING_ALL_DOCUMENTS,
  error
});// done fetching all documents

export const allDocuments = token => (dispatch) => {
  dispatch(fetchAllDocuments());
  return axios.get(`/api/v1/documents?token=${token}`).then((response) => {
    dispatch(fetchAllDocumentsComplete(response.data.documents));
  },
    ({ response }) => {
      dispatch(fetchAllDocumentsFailed(response.data.message));
    });
};
export const readADocument = docId => ({
  type: types.START_READING_DOCUMENT,
  docId,
});
export const readDocumentComplete = document => ({
  type: types.DONE_READING_DOCUMENT,
  document,
});
export const readDocumentFailed = error => ({
  type: types.ERROR_READING_DOCUMENT,
  error,
});
export const readDocument = (id, userToken) => (dispatch) => {
  dispatch(readADocument(id));
  return axios.get(`/api/v1/documents/${id}?token=${userToken}`)
  .then((response) => {
    dispatch(readDocumentComplete(response.data.document));
    return response.data;
  },
    ({ response }) => {
      dispatch(readDocumentFailed(response.data.message));
      return response.data;
    });
};

export const deleteDocumentStart = docId => ({
  type: types.START_DELETING_DOCUMENT,
  docId,
});
export const deleteDocumentComplete = message => ({
  type: types.DONE_DELETING_DOCUMENT,
  message,
});
export const deleteDocumentFailed = error => ({
  type: types.ERROR_DELETING_DOCUMENT,
  error,
});
export const deleteDocument = (id, userToken) => (dispatch) => {
  dispatch(deleteDocumentStart(id));
  return axios.delete(`/api/v1/documents/${id}?token=${userToken}`)
  .then((response) => {
    dispatch(deleteDocumentComplete(response.data.message));
    return response.data;
  },
    ({ response }) => {
      dispatch(deleteDocumentFailed(response.data.message));
      return response.data;
    });
};
