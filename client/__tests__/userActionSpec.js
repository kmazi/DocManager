import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as userAction from '../actions/userActions';
import * as types from '../actions/types';
import '../mockObjects/localStorage';

describe('userAction():', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());
  afterAll(() => {
    localStorage.clear();
  });
  test(`that startSignInUser function should return
    the correct action object`, () => {
    const actionObject = userAction.startSignInUser();
    expect(actionObject).toEqual({
      type: types.START_SIGNIN,
    });
  });

  test(`that finishSignInUser function should return
    the correct action object`, () => {
    const userDetail = {
      name: 'jackson',
      email: 'jackson@gmail.com',
    };
    const actionObject = userAction.finishSignInUser(userDetail);
    expect(actionObject).toEqual({
      type: types.SUCCESSFUL_SIGNIN,
      userDetail,
    });
  });

  test(`that errorSignInUser function should return
    the correct action object`, () => {
    const errors = ['No username', 'No password'];
    const actionObject = userAction.errorSignInUser(errors);
    expect(actionObject).toEqual({
      type: types.FAILED_SIGNIN,
      errors,
    });
  });

  test('creates SUCCESSFUL_SIGNIN when signing in user has been done',
  () => {
    const user = { name: 'jackson',
      email: 'jackson@gmail.com',
      roleValue: 'Admin' };
    const response = {
      token: 'sldhsofeslisfiesfse',
      roleType: 'Learning',
      user, };
    moxios.stubRequest('/api/v1/users/login', {
      status: 200,
      response,
    });

    const expectedActions = [
      { type: types.START_SIGNIN },
      { type: types.SET_USER_ROLE, userRole: 'Learning' },
      { type: types.SUCCESSFUL_SIGNIN, userDetail: response }
    ];
    const store = mockStore({ users: {} });
    return store.dispatch(userAction.signInUser(user)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test('creates SUCCESSFUL_SIGNIN when signing in user has an error', () => {
    const user = { name: 'jackson',
      email: 'jackson@gmail.com',
      roleValue: 'Admin' };
    const response = {
      token: 'sldhsofeslisfiesfse',
      roleType: 'Learning',
      user,
      message: 'an error occured' };
    moxios.stubRequest('/api/v1/users/login', {
      status: 400,
      response,
    });

    const expectedAction = [{ type: types.START_SIGNIN },
      { type: types.FAILED_SIGNIN,
        errors: 'an error occured', },
    ];
    const store = mockStore({ users: {} });
    return store.dispatch(userAction.signInUser(user)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  test(`that setUserRole function should return
    the correct action object`, () => {
    const userRole = 'Learning';
    const actionObject = userAction.setUserRole(userRole);
    expect(actionObject).toEqual({
      type: types.SET_USER_ROLE,
      userRole,
    });
  });

  test(`that startSignUpUser function should return
    the correct action object`, () => {
    const actionObject = userAction.startSignUpUser();
    expect(actionObject).toEqual({
      type: types.START_SIGNUP,
    });
  });

  test(`that finishSignUpUser function should return
    the correct action object`, () => {
    const userDetail = {
      name: 'jackson',
      password: 'testing1',
    };
    const actionObject = userAction.finishSignUpUser(userDetail);
    expect(actionObject).toEqual({
      type: types.SUCCESSFUL_SIGNUP,
      userDetail,
    });
  });

  test(`that errorSignUpUser function should return
    the correct action object`, () => {
    const errors = ['No username', 'No password'];
    const actionObject = userAction.errorSignUpUser(errors);
    expect(actionObject).toEqual({
      type: types.FAILED_SIGNUP,
      errors,
    });
  });

  test('creates SUCCESSFUL_SIGNUP when signing up user has been done',
  () => {
    const user = { name: 'jackson',
      email: 'jackson@gmail.com',
      roleValue: 'Admin' };
    const response = { token: 'sldhsofeslisfiesfse',
      roleType: 'Learning',
      user,
      message: 'unsuccessful' };
    moxios.stubRequest('/api/v1/users', {
      status: 200,
      response,
    });

    const expectedActions = [
      { type: types.START_SIGNUP, },
      { type: types.SET_USER_ROLE, userRole: 'Admin' },
      { type: types.SUCCESSFUL_SIGNUP, userDetail: response }
    ];
    const store = mockStore({ users: [] });
    store.dispatch(userAction.signUserUp(user)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test('creates SUCCESSFUL_SIGNUP when an error occurred signing up user',
  () => {
    const user = { name: 'jackson',
      email: 'jackson@gmail.com',
      roleValue: 'Learning' };
    const response = { token: 'sldhsofeslisfiesfse',
      roleType: 'Learning',
      user,
      message: 'unsuccessful' };
    moxios.stubRequest('/api/v1/users', {
      status: 400,
      response,
    });

    const expectedActions = [
      { type: types.START_SIGNUP, },
      { type: types.SET_USER_ROLE, userRole: 'Learning' },
      { type: types.FAILED_SIGNUP, errors: 'unsuccessful' }
    ];
    const store = mockStore({ users: [] });
    store.dispatch(userAction.signUserUp(user)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test(`that errorGettingUsers function should return
    the correct action object`, () => {
    const error = 'Restricted access';
    const responseStatus = 'unsuccessful';
    const actionObject = userAction.errorGettingUsers(error, responseStatus);
    expect(actionObject).toEqual({
      type: types.ERROR_GETTING_ALL_USERS,
      error,
      responseStatus,
    });
  });

  test(`that finishGettingUsers function should return
    the correct action object`, () => {
    const users = [{
      name: 'jackson',
      email: 'jackson@gmail.com',
    }, {
      name: 'prince',
      email: 'prince@gmail.com',
    }];
    const responseStatus = 'successful';
    const actionObject = userAction
      .finishGettingUsers(users, responseStatus, 2, 2);
    expect(actionObject).toEqual({
      type: types.FINISH_GETTING_ALL_USERS,
      users,
      responseStatus,
      count: 2,
      pageNumber: 2,
    });
  });

  it('creates FINISH_GETTING_ALL_USERS when signing up user has been done',
  () => {
    const users = [{ name: 'jackson',
      email: 'jackson@gmail.com',
      roleValue: 'Admin' }];
    const offset = 0;
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: { token,
      roleType: 'Learning',
      users,
      status: 'successful',
      count: 2,
      pageNumber: 1 } };
    nock('http://example.com/')
      .get(`/api/v1/users?&offset=${offset}&limit=8&token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_GETTING_ALL_USERS, },
      { type: types.FINISH_GETTING_ALL_USERS,
        users,
        responseStatus: response.data.status,
        count: response.data.count,
        pageNumber: response.data.pageNumber, }
    ];
    const store = mockStore({ users: [] });
    return store.dispatch(userAction.fetchAllUsers(offset, 1)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test(`that updatingUser function should return
    the correct action object when updating operation starts`, () => {
    const actionObject = userAction.updatingUser();
    expect(actionObject).toEqual({
      type: types.START_UPDATING_USER,
    });
  });

  test(`that doneUpdatingUser function should return
    the correct action object when updating user profile completes`, () => {
    const status = 'unsuccessful';
    const actionObject = userAction.doneUpdatingUser(status);
    expect(actionObject).toEqual({
      type: types.DONE_UPDATING_USER,
      status,
    });
  });

  test(`that errorUpdatingUser function should return
    the correct action object when updating user profile fails`, () => {
    const actionObject = userAction.errorUpdatingUser('Access denied!');
    expect(actionObject).toEqual({
      type: types.ERROR_UPDATING_USER,
      error: 'Access denied!',
    });
  });

  it('creates DONE_UPDATING_USER when signing up user has been done',
  () => {
    const userDetail = { name: 'jackson',
      email: 'jackson@gmail.com',
      roleValue: 'Admin' };
    const offset = 0;
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      message: 'No user found!' } };
    nock('http://example.com/')
      .get(`/api/v1/users?&offset=${offset}&limit=8&token=${token}`)
      .reply(200, response);

    const expectedActions = [
      { type: types.START_UPDATING_USER, },
      { type: types.DONE_UPDATING_USER,
        status: response.data.status, }, {
          type: types.ERROR_UPDATING_USER,
          error: 'No user found!', }
    ];
    const store = mockStore({ users: [] });
    return store.dispatch(userAction.editUserDetail(userDetail, 1)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test(`that setEmailInputValue function should return
    the correct action object when updating user profile starts`, () => {
    const email = 'jackson@gmail.com';
    const actionObject = userAction.setEmailInputValue(email);
    expect(actionObject).toEqual({
      type: types.UPDATE_EMAIL,
      email,
    });
  });

  test(`that doneDeactivatingUser function should return
    the correct action object when updating user profile is done`, () => {
    const actionObject = userAction.doneDeactivatingUser(4, 'successful');
    expect(actionObject).toEqual({
      type: types.DONE_DEACTIVATING_USER,
      status: 'successful',
      userId: 4,
    });
  });

  test(`that errorDeactivatingUser function should return
    the correct action object when updating user profile fails`, () => {
    const actionObject = userAction.errorDeactivatingUser();
    expect(actionObject).toEqual({
      type: types.ERROR_DEACTIVATING_USER,
    });
  });

  it('creates DONE_DEACTIVATING_USER when signing up user has been done',
  () => {
    const userId = 1;
    const token = 'sdfseflsfkjifsejfeis';
    const response = { data: {
      status: 'successful',
      message: 'No user found!' } };
    nock('http://example.com/')
      .delete(`/api/v1/users/${userId}?token=${token}`)
      .reply(200, response);

    const expectedActions = [
      {
        type: types.DONE_DEACTIVATING_USER,
        status: response.data.status,
        userId,
      }
    ];
    const store = mockStore({ users: [] });
    return store.dispatch(userAction.deactivateUser(userId)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  test(`that signOut function should return
    the correct action object when signing out a user`, () => {
    const actionObject = userAction.signOut();
    expect(actionObject).toEqual({
      type: types.USER_SIGNOUT,
    });
  });
});
