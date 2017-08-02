import request from 'request';
import index from '../../server/models';

const routeUrl = 'http://localhost:1844/api/v1';
describe('signUpUser(): ', () => {
  let userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 2,
    isactive: true,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };

  afterEach(() => {
    requestObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: userDetail,
    };
    const user = index.User;
    return user.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
    });
  });

  beforeEach(() => {
    userDetail = {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      password: 'testing1',
      roleId: 2,
      isactive: true,
    };
  });

  test.only(`should Add user info to database when all form fields
  are correctly filled`, (done) => {
    console.log('..............start running the test', requestObject);
    request(requestObject, (req, res, body) => {
      console.log('..............', body);
      expect(body.status).toBe('successful');
      expect(body.userName).toBe('jackson');
      expect(body.email).toBe('jackson@gmail.com');
      expect(body.roleType).toBe('Fellow');
      expect(res.statusCode).toBe(200);
      expect(body.token).not.toBeNull();
      done();
    });
  });

  // it('should not create user that already exist', (done) => {
  //   request(requestObject, () => {
  //     request(requestObject, (req, res, body) => {
  //       expect(body.status).toBe('unsuccessful');
  //       expect(res.statusCode).toBe(400);
  //       expect(body.message).toBe('User already exist');
  //       done();
  //     });
  //   });
  // });

  // it('should throw error when invalid form is posted', (done) => {
  //   requestObject.json = {
  //     userName: 'jadofd',
  //     userEmail: '@mail.com'
  //   };
  //   request(requestObject, (req, res, body) => {
  //     expect(body.status).not.toBe('successful');
  //     done();
  //   });
  // });

  // it('should throw error when invalid form is posted', (done) => {
  //   requestObject.json = {
  //     userName: 'jackson',
  //     email: 'jackson@gmail.com',
  //     password: 'testing1',
  //   };
  //   request(requestObject, (req, res, body) => {
  //     expect(body.status).not.toBe('successful');
  //     done();
  //   });
  // });
});

// describe('signInUser()', () => {
//   const userDetail = {
//     userName: 'jackson',
//     email: 'jackson@gmail.com',
//     password: 'testing1',
//     roleId: 2,
//     isactive: true,
//   };
//   let requestObject = {
//     url: `${routeUrl}/users`,
//     method: 'POST',
//     json: userDetail,
//   };

//   beforeEach((done) => {
//     request(requestObject, () => {
//       done();
//     });
//   });

//   afterEach((done) => {
//     requestObject = {
//       url: `${routeUrl}/users`,
//       method: 'POST',
//       json: userDetail,
//     };
//     userDetail.userName = 'jackson';
//     userDetail.password = 'testing1';
//     const user = index.User;
//     user.findOne({
//       where: {
//         username: userDetail.userName,
//       }
//     }).then((userFound) => {
//       if (userFound) {
//         userFound.destroy();
//       }
//       done();
//     }).catch();
//   });

//   it(`should return status as successful when
//   the user is successfully authenticated`, (done) => {
//       requestObject.url = `${routeUrl}/users/login`;
//       request(requestObject, (req, res, body) => {
//         expect(body.status).toBe('successful');
//         expect(body.userName).toBe('jackson');
//         expect(body.email).toBe('jackson@gmail.com');
//         expect(body.roleType).toBe('Fellow');
//         done();
//       });
//     });

//   it('should throw error when user dont exist in the database', (done) => {
//     requestObject.url = `${routeUrl}/users/login`;
//     userDetail.userName = 'john';
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('unsuccessful');
//       expect(body.message.includes('Wrong username!')).toBe(true);
//       expect(res.statusCode).toBe(400);
//       done();
//     });
//   });

//   it('should throw error when password is invalid', (done) => {
//     requestObject.url = `${routeUrl}/users/login`;
//     userDetail.password = 'james';
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('unsuccessful');
//       expect(body.message.includes('\nWrong password'))
//         .toBe(true);
//       expect(res.statusCode).toBe(400);
//       done();
//     });
//   });

//   it('should not get to this function when no password is inputed', (done) => {
//     requestObject.url = `${routeUrl}/users/login`;
//     userDetail.password = null;
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('unsuccessful');
//       expect(res.statusCode).toBe(400);
//       done();
//     });
//   });

//   it('should not get to this function when no username is inputed', (done) => {
//     requestObject.url = `${routeUrl}/users/login`;
//     userDetail.userName = undefined;
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('unsuccessful');
//       expect(body.message).not.toBe('Could not identify you!');
//       expect(res.statusCode).toBe(400);
//       done();
//     });
//   });
// });

// describe('viewUserProfile()', () => {
//   const userDetail = {
//     userName: 'jackson',
//     email: 'jackson@gmail.com',
//     password: 'testing1',
//     roleId: 2,
//     isactive: true,
//   };
//   let requestObject = {
//     url: `${routeUrl}/users`,
//     method: 'POST',
//     json: userDetail,
//   };

//   beforeEach((done) => {
//     request(requestObject, (req, res, body) => {
//       userDetail.userId = body.userId;
//       userDetail.token = body.token;
//       done();
//     });
//   });

//   afterEach((done) => {
//     requestObject = {
//       url: `${routeUrl}/users`,
//       method: 'POST',
//       json: userDetail,
//     };
//     userDetail.userName = 'jackson';
//     userDetail.password = 'testing1';
//     const user = index.User;
//     user.findOne({
//       where: {
//         username: userDetail.userName,
//       }
//     }).then((userFound) => {
//       if (userFound) {
//         userFound.destroy();
//       }
//       done();
//     }).catch();
//   });

//   it('should fail when no token is passed before viewing user profile',
//     (done) => {
//       requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
//       requestObject.method = 'GET';
//       requestObject.json.token = '';
//       request(requestObject, (req, res, body) => {
//         expect(body.status).toBe('unsuccessful');
//         expect(res.statusCode).toBe(400);
//         expect(body.message).toBe('You are not authenticated!');
//         done();
//       });
//     });

//   it('should fail when invalid token is passed', (done) => {
//     requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
//     requestObject.method = 'GET';
//     requestObject.json.token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC
//     .eyJ1c2VyTmFtZSI6ImphY2tzb24iLCJ1c2VySWQiOjE1MCwiZW1haWwiOiJqYW
//     Nrc29uQGdtYWlsLmNvbSI
//     sInJvbGVUeXBlIjoiRmVsbG93IiwiY3JlYXRlZEF0IjoiMjAxNy0wNy0zMFQ
//     xMTo0ODowNy45OTZaIiwiaWF0I
//     joxNTAxNDE1Mjg4fQ.V_I21frW8QFk8UUCz7xHAUwoxNi-VShlCH8L1-O_tMM`;
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('unsuccessful');
//       expect(body.message).toBe('You are not authenticated!');
//       expect(res.statusCode).toBe(400);
//       done();
//     });
//   });

//   it('should return user detail when valid token is passed', (done) => {
//     requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
//     requestObject.method = 'GET';
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('successful');
//       expect(res.statusCode).toBe(200);
//       done();
//     });
//   });

//   it('should not allow other users to access a particular user\'s profile',
//     (done) => {
//       requestObject.url = `${routeUrl}/users/${userDetail.userId - 4}`;
//       requestObject.method = 'GET';
//       request(requestObject, (req, res, body) => {
//         expect(body.status).toBe('unsuccessful');
//         expect(body.message).toBe('You cannot view another user\'s detail');
//         expect(res.statusCode).toBe(400);
//         done();
//       });
//     });

//   it('should return correct error message when userid is not a number',
//     (done) => {
//       requestObject.url = `${routeUrl}/users/a4`;
//       requestObject.method = 'GET';
//       request(requestObject, (req, res, body) => {
//         expect(body.status).toBe('unsuccessful');
//         expect(body.message).toBe('Error due to invalid user!');
//         expect(res.statusCode).toBe(400);
//         done();
//       });
//     });
// });

// describe('updateUser()', () => {
//   let userDetail = {
//     userName: 'jackson',
//     email: 'jackson@gmail.com',
//     password: 'testing1',
//     roleId: 2,
//     isactive: true,
//   };
//   let requestObject = {
//     url: `${routeUrl}/users`,
//     method: 'POST',
//     json: userDetail,
//   };
//   beforeEach((done) => {
//     console.log('user details just before initializing test...............', userDetail);
//     console.log('Request object just before each test...............', requestObject);
//     request(requestObject, (req, res, body) => {
//       console.log('Body..............', body);
//       userDetail = {
//         userName: 'jackson',
//         email: 'jackson@gmail.com',
//         password: 'testing1',
//         roleId: 2,
//         isactive: true,
//         userId: body.userId,
//         token: body.token,
//       };
//       requestObject = {
//         url: `${routeUrl}/users`,
//         method: 'POST',
//         json: userDetail,
//       };
//       console.log('user details just before each test...............', userDetail);
//       done();
//     });
//   });

//   afterEach((done) => {
//     userDetail.userName = 'jackson';
//     userDetail.password = 'testing1';
//     userDetail.roleId = 2;
//     const user = index.User;
//     user.findOne({
//       where: {
//         username: userDetail.userName,
//       }
//     }).then((userFound) => {
//       if (userFound) {
//         userFound.destroy();
//       }
//       requestObject = {
//         url: `${routeUrl}/users`,
//         method: 'POST',
//         json: userDetail,
//       };
//       done();
//     }).catch();
//   });

//   it(`should update a user's email successfully when their id
//       is correct and their updated info is valid`,
//   (done) => {
//     requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
//     requestObject.method = 'PUT';
//     requestObject.json.email = 'newjackson@gmail.com';
//     requestObject.json.userName = undefined;
//     requestObject.json.password = undefined;
//     requestObject.json.roleId = undefined;
//     requestObject.json.userId = undefined;
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('successful');
//       expect(res.statusCode).toBe(200);
//       done();
//     });
//   });

//   it(`should fail to update a user's email successfully when their id
//   is incorrect and their updated info is valid`,
//   (done) => {
//     requestObject.url = `${routeUrl}/users/${userDetail.userId - 4}`;
//     requestObject.method = 'PUT';
//     requestObject.json.email = 'newjackson@gmail.com';
//     requestObject.json.userName = undefined;
//     requestObject.json.password = undefined;
//     requestObject.json.roleId = undefined;
//     requestObject.json.userId = undefined;
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('unsuccessful');
//       expect(res.statusCode).toBe(400);
//       expect(body.message).toBe('No user found!');
//       done();
//     });
//   });

//   it(`should fail to update a user's email when their id
//   is correct and their updated email is invalid`,
//   (done) => {
//     requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
//     requestObject.method = 'PUT';
//     requestObject.json.email = 'newjacksongmail.com';
//     requestObject.json.userName = undefined;
//     requestObject.json.password = undefined;
//     requestObject.json.roleId = undefined;
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('unsuccessful');
//       expect(res.statusCode).toBe(400);
//       expect(body.message).not.toBeNull();
//       done();
//     });
//   });

//   it('should fail to update a user\'s role unless by the superadmin',
//   (done) => {
//     requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
//     requestObject.method = 'PUT';
//     requestObject.json.userName = undefined;
//     requestObject.json.email = undefined;
//     requestObject.json.password = undefined;
//     requestObject.json.roleId = 4;
//     request(requestObject, (req, res, body) => {
//       expect(body.status).toBe('unsuccessful');
//       expect(res.statusCode).toBe(400);
//       expect(body.message).not.toBeNull();
//       done();
//     });
//   });
// });

