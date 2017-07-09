import request from 'request';
import queryString from 'querystring';
import index from '../../server/models';

const url = 'http://localhost:1844/';
describe('When signing up users with signUpUser(): ', () => {
  const userDetails = {
    userName: 'audax',
    email: 'audax.mazi@andela.com',
    password: 'testing4',
    roleId: '1',
  };

  afterAll((done) => {
    const user = index.User;
    user.destroy({
      where: {
        username: 'audax',
      }
    }).then(() => {
      done();
    });
  });
  it(`should Add user info to database when all form fields
  are correctly filled`, (done) => {
    const route = `${url}users`;
    request({
      url: route,
      method: 'POST',
      json: userDetails,
    }, (req, res, body) => {
      expect(body.status).toBe('successful');
      expect(body.userName).toBe('audax');
      expect(body.token).not.toBeNull();
      done();
    });
  });

  it('should not create users with the same username', (done) => {
    const route = `${url}users`;
    request({
      url: route,
      method: 'POST',
      json: userDetails,
    }, () => {
      request({
        url: route,
        method: 'POST',
        json: userDetails,
      }, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(body.message).toBe('User already exist');
        done();
      });
    });
  });

  it('should return error when some fields are not filled', (done) => {
    const route = `${url}users`;
    userDetails.email = '';
    request({
      url: route,
      method: 'POST',
      json: userDetails,
    }, (req, res, body) => {
      expect(body.email.length).not.toBe(0);
      done();
    });
  });

  it('should return error when invalid email is filled', (done) => {
    const route = `${url}users`;
    userDetails.email = 'hgfuy.com';
    userDetails.password = 'hgfuy';
    request({
      url: route,
      method: 'POST',
      json: userDetails,
    }, (req, res, body) => {
      expect(body.email.length).not.toBe(0);
      expect(body.email[0]).toBe('Email has got a wrong format');
      expect(body.password.length).not.toBe(0);
      expect(body.password.includes('Password length must be between 6 and 20'))
        .toBe(true);
      done();
    });
  });
});

describe('When signing in users with signInUser()', () => {
  it(`should return status as successful when
  the user is successfully authenticated`, (done) => {
    const info = queryString.stringify({
      userName: 'james007',
      password: 'testing1',
    });
    const signInUrl = `${url}users?${info}`;
    request({
      url: signInUrl,
      method: 'GET',
      json: info,
    }, (req, res, body) => {
      expect(body.status).toBe('successful');
      done();
    });
  });
});
