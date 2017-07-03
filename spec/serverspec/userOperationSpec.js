import request from 'request';
import index from '../../server/models';

describe('Signup: ', () => {
  const userDetails = {
    userName: 'audax',
    email: 'audax.mazi@andela.com',
    password: 'testing4',
    roleId: '1',
  };
  // beforeAll((done) => {
  //   const user = index.User;
  //   user.create({
  //     username: userDetials.userName,
  //     email: userDetials.email,
  //     password: userDetials.password,
  //     roleId: userDetials.roleId,

  //   }).then(() => {
  //     done();
  //   });
  // });

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
  const url = 'http://localhost:1844/';
  it(`should Add user info to database when all form fields
  are correctly filled`, (done) => {
      const route = `${url}users`;
      request({
        url: route,
        method: 'POST',
        json: userDetails,
      }, (req, res, body) => {
        expect(body.status).toBe('successful');
        done();
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
    request({
      url: route,
      method: 'POST',
      json: userDetails,
    }, (req, res, body) => {
      expect(body.email.length).not.toBe(0);
      expect(body.email[0]).toBe('Email has got a wrong format');
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
      expect(body.password.includes('Password length must be between 6 and 20')).toBe(true);
      done();
    });
  });
});
