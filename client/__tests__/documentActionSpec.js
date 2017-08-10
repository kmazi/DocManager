import nock from 'nock';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as documentAction from '../actions/documentActions';
import * as types from '../actions/types';
import '../mockObjects/localStorage';

describe('documentAction():', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  afterEach(() => {
    nock.cleanAll();
  });
  afterAll(() => {
    localStorage.clear();
  });

  test(`that startCreatingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.startCreatingDocument();
    expect(actionObject).toEqual({
      type: types.START_CREATING_DOCUMENT,
    });
  });

  test(`that doneCreatingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.doneCreatingDocument('ready');
    expect(actionObject).toEqual({
      type: types.DONE_CREATING_DOCUMENT,
      status: 'ready',
    });
    expect(actionObject.type).toBe(types.DONE_CREATING_DOCUMENT);
  });

  test(`that errorCreatingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.errorCreatingDocument('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_CREATING_DOCUMENT,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_CREATING_DOCUMENT);
  });

  it('creates DONE_CREATING_DOCUMENT when signing up user has been done',
  () => {
    const formValue = { userId: 1,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const userId = 1;
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      message: 'No user found!' } };
    nock('http://example.com/')
      .delete(`/api/v1/users/${userId}?token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_CREATING_DOCUMENT, },
      { type: types.DONE_CREATING_DOCUMENT,
        status: response.data.status, },
    ];
    const store = mockStore({});
    return store.dispatch(documentAction.documentCreation(formValue))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that startGetUserDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.startGetUserDocuments();
    expect(actionObject).toEqual({
      type: types.START_GET_USER_DOCUMENT,
    });
  });

  test(`that completeGetUserDocuments function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction.completeGetUserDocuments(documents, 2);
    expect(actionObject.count).toBe(2);
    expect(actionObject.documents.length).not.toBe(0);
    expect(actionObject.type).toBe(types.SUCCESS_GET_USER_DOCUMENT);
  });

  test(`that errorGetUserDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.errorGetUserDocuments('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_GET_USER_DOCUMENT,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_GET_USER_DOCUMENT);
  });

  it(`creates SUCCESS_GET_USER_DOCUMENT when fetching
    public documents has been done`,
  () => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      count: 1,
      documents: [formValue] } };
    nock('http://example.com/')
      .get(`/api/v1/users/1/documents?&offset=0&limit=8&token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_GET_USER_DOCUMENT, },
      { type: types.SUCCESS_GET_USER_DOCUMENT,
        documents: response.data.documents,
        count: response.data.count, },
    ];
    const store = mockStore({ documents: [] });
    return store.dispatch(documentAction.getUserDocuments(formValue.userId))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that fetchingPublicDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.fetchingPublicDocuments();
    expect(actionObject).toEqual({
      type: types.START_FETCHING_PUBLIC_DOCUMENTS,
    });
  });

  test(`that fetchingPublicDocumentsComplete function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .fetchingPublicDocumentsComplete(documents, 2);
    expect(actionObject.type).toEqual(types.DONE_FETCHING_PUBLIC_DOCUMENTS);
    expect(actionObject.count).toBe(2);
    expect(actionObject.documents.length).not.toBe(0);
  });

  test(`that fetchingPublicDocumentsFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .fetchingPublicDocumentsFailed('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_FETCHING_PUBLIC_DOCUMENTS,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_FETCHING_PUBLIC_DOCUMENTS);
  });

  it(`creates DONE_FETCHING_PUBLIC_DOCUMENTS when fetching
    public documents has been done`,
  () => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      count: 1,
      documents: [formValue] } };
    nock('http://example.com/')
      .get(`/api/v1/documents/Public?&offset=0&limit=8&token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_FETCHING_PUBLIC_DOCUMENTS, },
      { type: types.DONE_FETCHING_PUBLIC_DOCUMENTS,
        documents: response.data.documents,
        count: response.data.count, },
    ];
    const store = mockStore({ documents: [] });
    return store.dispatch(documentAction.publicDocuments())
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that fetchRoleDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.fetchRoleDocuments('Learning');
    expect(actionObject).toEqual({
      type: types.START_FETCHING_ROLE_DOCUMENTS,
      roleType: 'Learning',
    });
    const actionObject1 = documentAction.fetchRoleDocuments();
    expect(actionObject1.roleType).toEqual('Loading...');
  });

  test(`that fetchRoleDocumentsComplete function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .fetchRoleDocumentsComplete(documents, 2, 'Devops');
    expect(actionObject.type).toEqual(types.DONE_FETCHING_ROLE_DOCUMENTS);
    expect(actionObject.count).toBe(2);
    expect(actionObject.roleType).toBe('Devops');
    expect(actionObject.documents.length).not.toBe(0);
  });

  test(`that fetchRoleDocumentsFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .fetchRoleDocumentsFailed('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_FETCHING_ROLE_DOCUMENTS,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_FETCHING_ROLE_DOCUMENTS);
  });

  it(`creates DONE_FETCHING_ROLE_DOCUMENTS when fetching
    'Learning' documents has been done`,
  () => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      count: 1,
      documents: [formValue] } };
    nock('http://example.com/')
      .get(`/api/v1/documents/Learning?&offset=0&limit=8&token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_FETCHING_ROLE_DOCUMENTS,
        roleType: 'Learning' || 'Loading...', },
      { type: types.DONE_FETCHING_ROLE_DOCUMENTS,
        documents: response.data.documents,
        count: response.data.count,
        roleType: 'Learning' }
    ];
    const store = mockStore({ documents: [] });
    return store.dispatch(documentAction.roleDocuments('Learning'))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that fetchAllDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction.fetchAllDocuments();
    expect(actionObject).toEqual({
      type: types.START_FETCHING_ALL_DOCUMENTS,
    });
  });

  test(`that fetchAllDocumentsComplete function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .fetchAllDocumentsComplete(documents, 2);
    expect(actionObject.type).toEqual(types.DONE_FETCHING_ALL_DOCUMENTS);
    expect(actionObject.count).toBe(2);
    expect(actionObject.documents.length).not.toBe(0);
    expect(actionObject.documents[1].id).not.toBe(1);
  });

  test(`that fetchAllDocumentsFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .fetchAllDocumentsFailed('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_FETCHING_ALL_DOCUMENTS,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_FETCHING_ALL_DOCUMENTS);
  });

  it(`creates DONE_FETCHING_ALL_DOCUMENTS when fetching
    all documents a user has access to has been done`,
  () => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      count: 1,
      documents: [formValue] } };
    nock('http://example.com/')
      .get(`/api/v1/documents?&offset=0&limit=8&token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_FETCHING_ALL_DOCUMENTS, },
      { type: types.DONE_FETCHING_ALL_DOCUMENTS,
        documents: response.data.documents,
        count: response.data.count, }
    ];
    const store = mockStore({ documents: [] });
    return store.dispatch(documentAction.allDocuments('Learning'))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that readADocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.readADocument(2);
    expect(actionObject).toEqual({
      type: types.START_READING_DOCUMENT,
      docId: 2,
    });
  });

  test(`that readDocumentComplete function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .readDocumentComplete(documents);
    expect(actionObject.type).toEqual(types.DONE_READING_DOCUMENT);
    expect(actionObject.document.length).not.toBe(0);
    expect(actionObject.document[1].id).toBe(2);
  });

  test(`that readDocumentFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .readDocumentFailed('Access denied');
    expect(actionObject).toEqual({
      type: types.ERROR_READING_DOCUMENT,
      error: 'Access denied',
    });
    expect(actionObject.type).toBe(types.ERROR_READING_DOCUMENT);
  });

  it(`creates DONE_READING_DOCUMENT when reading
    a particular document a user has access to has been done`,
  () => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      count: 1,
      documents: [formValue],
      message: 'An error occurred while reading your document' } };
    nock('http://example.com/')
      .get(`/api/v1/document/2?offset=0&limit=8&token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_READING_DOCUMENT,
        docId: 2 },
      { type: types.DONE_READING_DOCUMENT,
        document: response.data.documents[0], }
    ];
    const store = mockStore({ document: {} });
    return store.dispatch(documentAction.readDocument(2))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that setTitleInputValue function should return
    the correct action object`, () => {
    const actionObject = documentAction.setTitleInputValue('I love c#');
    expect(actionObject).toEqual({
      type: types.UPDATE_TITLE,
      title: 'I love c#',
    });
  });

  test(`that startEditingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction.startEditingDocument();
    expect(actionObject).toEqual({
      type: types.START_EDITING_DOCUMENT,
    });
  });

  test(`that doneEditingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .doneEditingDocument(2);
    expect(actionObject.type).toEqual(types.DONE_EDITING_DOCUMENT);
    expect(actionObject.documentId).toBe(2);
  });

  test(`that errorEditingDocument function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .errorEditingDocument();
    expect(actionObject).toEqual({
      type: types.ERROR_EDITING_DOCUMENT,
    });
    expect(actionObject.type).toBe(types.ERROR_EDITING_DOCUMENT);
  });

  it(`creates DONE_EDITING_DOCUMENT when fetching
    all documents a user has access to has been done`,
  () => {
    const formValue = { userId: 1,
      documentId: 2,
      title: 'hello',
      body: 'Hie',
      access:
      'Pubic' };
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      count: 1,
      documents: [formValue] } };
    nock('http://example.com/')
      .put(`/api/v1/documents/2?token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_EDITING_DOCUMENT, },
      { type: types.DONE_EDITING_DOCUMENT,
        documentId: response.data.documents[0].documentId, }
    ];
    const store = mockStore({ document: {} });
    return store.dispatch(documentAction.editDocument(formValue, 2))
      .then(() => {
      // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test(`that deleteDocumentStart function should return
    the correct action object`, () => {
    const actionObject = documentAction.deleteDocumentStart(2);
    expect(actionObject).toEqual({
      type: types.START_DELETING_DOCUMENT,
      docId: 2,
    });
  });

  test(`that deleteDocumentComplete function should return
    the correct action object`, () => {
    const actionObject = documentAction.deleteDocumentComplete('successful', 2);
    expect(actionObject).toEqual({
      type: types.DONE_DELETING_DOCUMENT,
      docId: 2,
      message: 'successful',
    });
  });

  test(`that deleteDocumentFailed function should return
    the correct action object`, () => {
    const actionObject = documentAction.deleteDocumentFailed('Access denied!');
    expect(actionObject).toEqual({
      type: types.ERROR_DELETING_DOCUMENT,
      error: 'Access denied!',
    });
  });

  test(`that doneSearchingDocuments function should return
    the correct action object`, () => {
    const documents = [{ id: 1, title: 'Fish bone' },
      { id: 2, title: 'Fish flesh' }];
    const actionObject = documentAction
      .doneSearchingDocuments(documents, 2, 1, 'Private');
    expect(actionObject).toEqual({
      type: types.DONE_SEARCHING_DOCUMENTS,
      documents,
      access: 'Private',
      pageNumber: 1,
      count: 2,
    });
  });

  test(`that errorSearchingDocuments function should return
    the correct action object`, () => {
    const actionObject = documentAction
      .errorSearchingDocuments('No result found!');
    expect(actionObject).toEqual({
      type: types.ERROR_SEARCHING_DOCUMENTS,
      error: 'No result found!',
    });
  });

  test(`that paginationUrl function should return
    the correct url link when access is Private`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Private', 0, 2, 'Learning', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/users/2/documents?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is Public`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Public', 0, 2, 'Learning', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/Public?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is Admin`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Admin', 0, 2, 'Admin', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/Admin?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is Public`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Learning', 0, 2, 'Learning', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/Learning?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is Public`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('Devops', 0, 2, 'Devops', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/Devops?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is All`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('All', 0, 2, 'All', 'Hi');
    expect(actionObject)
      .toBe('/api/v1/documents/All?&offset=0&limit=8&token=hsiejsilelia');
    const actionObject1 = documentAction
      .paginationUrl('All', 0, 2, 'Admin', 'Hi');
    expect(actionObject1)
      .toBe('/api/v1/documents?&offset=0&limit=8&token=hsiejsilelia');
  });

  test(`that paginationUrl function should return
    the correct url link when access is not set`, () => {
    localStorage.setItem('docmanagertoken', 'hsiejsilelia');
    const actionObject = documentAction
      .paginationUrl('', 0, 2, 'Devops', 'Hi');
    expect(actionObject)
    .toBe('/api/v1/search/documents?q=Hi&offset=0&limit=8&token=hsiejsilelia');
  });
});

