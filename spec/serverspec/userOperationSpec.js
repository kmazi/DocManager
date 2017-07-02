import request from 'request';
import index from '../../server/models';

describe('When signin up a user:', () => {
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
  it(`successfully add user info to database when all form fields
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
});
