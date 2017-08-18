import request from 'request';
import index from '../../server/models';
import mockUsers from './mockUsers';

const routeUrl = 'http://localhost:1844/api/v1';
describe('signUp: ', () => {
  let userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };

  afterEach((done) => {
    requestObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: userDetail,
    };
    const user = index.User;
    user.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      done();
    }).catch(() => {
      done();
    });
  });

  beforeEach(() => {
    userDetail = {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      password: 'testing1',
      roleId: 3,
      isactive: true,
    };
  });

  it(`should Add user info to database when all form fields
  are correctly filled`, (done) => {
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('successful');
      expect(body.userName).toBe('jackson');
      expect(body.email).toBe('jackson@gmail.com');
      expect(body.roleType).toBe('Fellow');
      expect(res.statusCode).toBe(200);
      expect(body.token).not.toBeNull();
      done();
    });
  });

  it('should not create user that already exist', (done) => {
    request(requestObject, () => {
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(res.statusCode).toBe(400);
        expect(body.message).toBe('User already exist');
        done();
      });
    });
  });

  it('should throw error when invalid form is posted', (done) => {
    requestObject.json = {
      userName: 'jadofd',
      userEmail: '@mail.com'
    };
    request(requestObject, (req, res, body) => {
      expect(body.status).not.toBe('successful');
      expect(body.message.length).toBe(2);
      done();
    });
  });

  it('should throw error when isactive status is not set', (done) => {
    requestObject.json = {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      password: 'testing1',
    };
    request(requestObject, (req, res, body) => {
      expect(body.status).not.toBe('successful');
      expect(body.message.includes('Set "isactive" property')).toBe(true);
      done();
    });
  });
});

describe('signIn: ', () => {
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };

  beforeEach((done) => {
    request(requestObject, (req, res, body) => {
      userDetail.userId = body.userId;
      done();
    });
  });

  afterEach((done) => {
    requestObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: userDetail,
    };
    userDetail.userName = 'jackson';
    userDetail.password = 'testing1';
    const user = index.User;
    user.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      done();
    }).catch();
  });

  it(`should return status as successful when
  the user is successfully authenticated`, (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('successful');
      expect(body.userName).toBe('jackson');
      expect(body.email).toBe('jackson@gmail.com');
      expect(body.roleType).toBe('Fellow');
      done();
    });
  });

  it('should throw error when user dont exist in the database', (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    userDetail.userName = 'john';
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message.includes('Wrong username!')).toBe(true);
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it(`should return valid error message when a
  deactivated user tries to signup`, (done) => {
    const superAdmin = {
      url: `${routeUrl}/users/login`,
      method: 'POST',
      json: {
        userName: 'SuperAdmin',
        password: 'testing1',
      }
    };
    requestObject.url = `${routeUrl}/users/login`;
    // signin as superadmin
    request(superAdmin, (req, res, body0) => {
      superAdmin.url = `${routeUrl}/users/${userDetail.userId}`;
      superAdmin.json.token = body0.token;
      superAdmin.method = 'DELETE';
      // deactivate user
      request(superAdmin, () => {
        request(requestObject, (req, res, body) => {
          expect(body.status).toBe('unsuccessful');
          expect(body.message).toBe('user is inactive');
          expect(res.statusCode).toBe(400);
          done();
        });
      });
    });
  });

  it('should throw error when password is invalid', (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    userDetail.password = 'james';
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message.includes('\nWrong password'))
        .toBe(true);
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('should not get to this function when no password is inputed', (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    userDetail.password = null;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('should not get to this function when no username is inputed', (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    userDetail.userName = undefined;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).not.toBe('Could not identify you!');
      expect(res.statusCode).toBe(400);
      done();
    });
  });
});

describe('viewProfile: ', () => {
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };

  beforeEach((done) => {
    request(requestObject, (req, res, body) => {
      userDetail.userId = body.userId;
      userDetail.token = body.token;
      done();
    });
  });

  afterEach((done) => {
    requestObject = {
      url: `${routeUrl}/users`,
      method: 'POST',
      json: userDetail,
    };
    userDetail.userName = 'jackson';
    userDetail.password = 'testing1';
    const user = index.User;
    user.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      done();
    }).catch();
  });

  it('should fail when no token is passed before viewing user profile',
    (done) => {
      requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
      requestObject.method = 'GET';
      requestObject.json.token = '';
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(res.statusCode).toBe(400);
        expect(body.message).toBe('You are not authenticated!');
        done();
      });
    });

  it('should fail when invalid token is passed', (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'GET';
    requestObject.json.token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC
    .eyJ1c2VyTmFtZSI6ImphY2tzb24iLCJ1c2VySWQiOjE1MCwiZW1haWwiOiJqYW
    Nrc29uQGdtYWlsLmNvbSI
    sInJvbGVUeXBlIjoiRmVsbG93IiwiY3JlYXRlZEF0IjoiMjAxNy0wNy0zMFQ
    xMTo0ODowNy45OTZaIiwiaWF0I
    joxNTAxNDE1Mjg4fQ.V_I21frW8QFk8UUCz7xHAUwoxNi-VShlCH8L1-O_tMM`;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).toBe('You are not authenticated!');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('should return user detail when valid token is passed', (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'GET';
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('successful');
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it('should not allow other users to access a particular user\'s profile',
    (done) => {
      requestObject.url = `${routeUrl}/users/${userDetail.userId - 4}`;
      requestObject.method = 'GET';
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(body.message).toBe('You cannot view another user\'s detail');
        expect(res.statusCode).toBe(400);
        done();
      });
    });

  it('should return correct error message when userid is not a number',
    (done) => {
      requestObject.url = `${routeUrl}/users/a4`;
      requestObject.method = 'GET';
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(body.message).toBe('Error due to invalid user!');
        expect(res.statusCode).toBe(400);
        done();
      });
    });

  it(`should prevent a deactivated user from viewing
  their profile`, (done) => {
    const superAdmin = {
      url: `${routeUrl}/users/login`,
      method: 'POST',
      json: {
        userName: 'SuperAdmin',
        password: 'testing1',
      }
    };
    requestObject.url = `${routeUrl}/users/login`;
    // signin as superadmin
    request(superAdmin, (req, res, body0) => {
      superAdmin.url = `${routeUrl}/users/${userDetail.userId}`;
      superAdmin.json.token = body0.token;
      superAdmin.method = 'DELETE';
      // deactivate user
      request(superAdmin, () => {
        requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
        requestObject.method = 'GET';
        request(requestObject, (req, res, body) => {
          expect(body.status).toBe('unsuccessful');
          expect(body.message).toBe('Inactive user!');
          expect(res.statusCode).toBe(400);
          done();
        });
      });
    });
  });
});

describe('getAll: ', () => {
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 5,
    isactive: true,
  };
  let userToken;
  let adminToken;
  let superAdminToken;
  const userObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  const adminLogin = {
    url: `${routeUrl}/users/login`,
    method: 'POST',
    json: {
      userName: 'touchstone',
      password: 'testing1',
    }
  };
  const superAdminLogin = {
    url: `${routeUrl}/users/login`,
    method: 'POST',
    json: {
      userName: 'SuperAdmin',
      password: 'testing1',
    }
  };
  const User = index.User;
  let allUsers;
  beforeAll((done) => {
    request(userObject, (req, res, body) => {
      userToken = body.token;
      request(adminLogin, (req, res, body1) => {
        adminToken = body1.token;
        adminLogin.body = body1;
        request(superAdminLogin, (req, res, body2) => {
          superAdminToken = body2.token;
          User.bulkCreate(mockUsers)
          .then(() => User.findAll()).then((users) => {
            allUsers = users.map(user => user.dataValues);
            done();
          }).catch(() => {
            done();
          });
        });
      });
    });
  });

  afterAll((done) => {
    User.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      User.destroy({ where: {
        roleId: 3,
      }, });
      done();
    }).catch(() => {
      done();
    });
  });

  it('Should deny access to unauthenticated user from viewing all users',
  (done) => {
    const apiObject = {
      url: `${routeUrl}/users`,
      method: 'GET',
      json: {
        token: 'ksfdodjfisd.sfldsfskdfdklfd.dlsjdfslfk'
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).toBe('You are not authenticated!');
      expect(body.status).toBe('unsuccessful');
      done();
    });
  });

  it('Should deny a regular user from viewing all users route',
  (done) => {
    const apiObject = {
      url: `${routeUrl}/users`,
      method: 'GET',
      json: {
        token: userToken,
        user: allUsers[0],
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).toBe('Access denied!');
      expect(body.status).toBe('unsuccessful');
      done();
    });
  });

  it('Should allow admin to view all users in the database',
  (done) => {
    const apiObject = {
      url: `${routeUrl}/users?limit=8`,
      method: 'GET',
      json: {
        token: adminToken
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).not.toBe('You are not authenticated!');
      expect(body.status).toBe('successful');
      expect(res.statusCode).toBe(200);
      expect(body.users.length).toBe(8);
      done();
    });
  });

  it('Should allow superadmin to view all users in the database',
  (done) => {
    const apiObject = {
      url: `${routeUrl}/users?offset=4`,
      method: 'GET',
      json: {
        token: superAdminToken,
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).not.toBe('You are not authenticated!');
      expect(body.status).toBe('successful');
      expect(res.statusCode).toBe(200);
      expect(body.users.length).toBe(5);
      done();
    });
  });

  it(`Should reset limit and offset to 8 and 0 respectively when
  they are not set`,
  (done) => {
    const apiObject = {
      url: `${routeUrl}/users?offset=null&limit=null`,
      method: 'GET',
      json: {
        token: superAdminToken,
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).not.toBe('You are not authenticated!');
      expect(body.status).toBe('successful');
      expect(res.statusCode).toBe(200);
      expect(body.users.length).toBe(8);
      done();
    });
  });
});

describe('find: ', () => {
  const userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 5,
    isactive: true,
  };
  let userToken;
  let adminToken;
  let superAdminToken;
  const userObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  const adminLogin = {
    url: `${routeUrl}/users/login`,
    method: 'POST',
    json: {
      userName: 'touchstone',
      password: 'testing1',
    }
  };
  const superAdminLogin = {
    url: `${routeUrl}/users/login`,
    method: 'POST',
    json: {
      userName: 'SuperAdmin',
      password: 'testing1',
    }
  };
  const User = index.User;
  let allUsers;
  beforeAll((done) => {
    request(userObject, (req, res, body) => {
      userToken = body.token;
      request(adminLogin, (req, res, body1) => {
        adminToken = body1.token;
        adminLogin.body = body1;
        request(superAdminLogin, (req, res, body2) => {
          superAdminToken = body2.token;
          User.bulkCreate(mockUsers)
          .then(() => User.findAll()).then((users) => {
            allUsers = users.map(user => user.dataValues);
            done();
          }).catch(() => {
            done();
          });
        });
      });
    });
  });

  afterAll((done) => {
    User.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      User.destroy({ where: {
        roleId: 3,
      }, });
      done();
    }).catch(() => {
      done();
    });
  });

  it('Should deny access to unauthenticated user from searching through users',
  (done) => {
    const apiObject = {
      url: `${routeUrl}/search/users`,
      method: 'GET',
      json: {
        token: 'ksfdodjfisd.sfldsfskdfdklfd.dlsjdfslfk',
        users: allUsers,
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).toBe('You are not authenticated!');
      expect(body.status).toBe('unsuccessful');
      done();
    });
  });

  it('Should deny a regular user from searching through users',
  (done) => {
    const apiObject = {
      url: `${routeUrl}/search/users?q=te&limit=8`,
      method: 'GET',
      json: {
        token: userToken,
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).toBe('Access denied!');
      expect(body.status).toBe('unsuccessful');
      done();
    });
  });

  it(`Should return an error message when a search request is
  sent without a search string`,
  (done) => {
    const apiObject = {
      url: `${routeUrl}/search/users?q=`,
      method: 'GET',
      json: {
        token: adminToken
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).not.toBe('You are not authenticated!');
      expect(body.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it('Should allow superadmin to search through users in the database',
  (done) => {
    const apiObject = {
      url: `${routeUrl}/search/users?q=r&offset=0`,
      method: 'GET',
      json: {
        token: superAdminToken,
      }
    };
    request(apiObject, (req, res, body) => {
      expect(body.message).not.toBe('You are not authenticated!');
      expect(body.status).toBe('successful');
      expect(res.statusCode).toBe(200);
      expect(body.users.length).toBe(3);
      done();
    });
  });
});

describe('update: ', () => {
  let userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  beforeEach((done) => {
    request(requestObject, (req, res, body) => {
      userDetail = {
        userName: 'jackson',
        email: 'jackson@gmail.com',
        password: 'testing1',
        roleId: 3,
        isactive: true,
        userId: body.userId,
        token: body.token,
      };
      requestObject = {
        url: `${routeUrl}/users`,
        method: 'POST',
        json: userDetail,
      };
      done();
    });
  });

  afterEach((done) => {
    userDetail.userName = 'jackson';
    userDetail.password = 'testing1';
    userDetail.roleId = 3;
    const user = index.User;
    user.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      requestObject = {
        url: `${routeUrl}/users`,
        method: 'POST',
        json: userDetail,
      };
      done();
    }).catch();
  });

  it(`should update a user's email successfully when their id
      is correct and their updated info is valid`,
  (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'PUT';
    requestObject.json.email = 'newjackson@gmail.com';
    requestObject.json.userName = undefined;
    requestObject.json.password = undefined;
    requestObject.json.roleId = undefined;
    requestObject.json.userId = undefined;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('successful');
      expect(res.statusCode).toBe(200);
      done();
    });
  });

  it(`should fail to update a user's email successfully when their id
  is incorrect and their updated info is valid`,
  (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId - 4}`;
    requestObject.method = 'PUT';
    requestObject.json.email = 'newjackson@gmail.com';
    requestObject.json.userName = undefined;
    requestObject.json.password = undefined;
    requestObject.json.roleId = undefined;
    requestObject.json.userId = undefined;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      expect(body.message).toBe('No user found!');
      done();
    });
  });

  it(`should fail to update a user's email when their id
  is correct and their updated email is invalid`,
  (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'PUT';
    requestObject.json.email = 'newjacksongmail.com';
    requestObject.json.userName = undefined;
    requestObject.json.password = undefined;
    requestObject.json.roleId = undefined;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      expect(body.message).not.toBeNull();
      done();
    });
  });

  it('should fail to update a user\'s role unless by the superadmin',
  (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'PUT';
    requestObject.json.userName = undefined;
    requestObject.json.email = undefined;
    requestObject.json.password = undefined;
    requestObject.json.roleId = 4;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      expect(body.message).not.toBeNull();
      done();
    });
  });
});

describe('Delete: ', () => {
  let userDetail = {
    userName: 'jackson',
    email: 'jackson@gmail.com',
    password: 'testing1',
    roleId: 3,
    isactive: true,
  };
  let requestObject = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: userDetail,
  };
  beforeEach((done) => {
    request(requestObject, (req, res, body) => {
      userDetail = {
        userName: 'jackson',
        email: 'jackson@gmail.com',
        password: 'testing1',
        roleId: 3,
        isactive: true,
        userId: body.userId,
        token: body.token,
      };
      requestObject = {
        url: `${routeUrl}/users`,
        method: 'POST',
        json: userDetail,
      };
      done();
    });
  });

  afterEach((done) => {
    userDetail.userName = 'jackson';
    userDetail.password = 'testing1';
    userDetail.roleId = 3;
    const user = index.User;
    user.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      requestObject = {
        url: `${routeUrl}/users`,
        method: 'POST',
        json: userDetail,
      };
      done();
    }).catch(() => {
      done();
    });
  });

  it('should not deactivate a user when not logged in as admin', (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'DELETE';
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).toBe('Access denied!');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it(`should return error message when an unauthenticated 
    user tries to deactivate a user`, (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'DELETE';
    requestObject.json.token = 'sjdhsoeodufls.sklfseiflesifl.dsldfielsilejfs';
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).toBe('You are not authenticated!');
      expect(res.statusCode).toBe(400);
      done();
    });
  });

  it(`should return error message when an admin enters 
  an invalid user id to deactivate`, (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    requestObject.method = 'POST';
    requestObject.json.userName = 'touchstone';
    requestObject.json.password = 'testing1';
    request(requestObject, (req, res, body) => {
      requestObject.url = `${routeUrl}/users/8a`;
      requestObject.method = 'DELETE';
      requestObject.json.token = body.token;
      request(requestObject, (req, res, resBody) => {
        expect(resBody.status).toBe('unsuccessful');
        expect(res.statusCode).toBe(500);
        expect(resBody.message).toBe('Invalid user ID!');
        done();
      });
    });
  });

  it(`should allow admin to successfully deactivate
    a user`, (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    requestObject.method = 'POST';
    requestObject.json.userName = 'touchstone';
    requestObject.json.password = 'testing1';
    request(requestObject, (req, res, body) => {
      requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
      requestObject.method = 'DELETE';
      requestObject.json.token = body.token;
      request(requestObject, (req, res, resBody) => {
        expect(resBody.status).toBe('successful');
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });

  it(`should throw correct error message when
    admin enters a user ID that isnt in the database`, (done) => {
    requestObject.url = `${routeUrl}/users/login`;
    requestObject.method = 'POST';
    requestObject.json.userName = 'touchstone';
    requestObject.json.password = 'testing1';
    request(requestObject, (req, res, body) => {
      requestObject.url = `${routeUrl}/users/1500`;
      requestObject.method = 'DELETE';
      requestObject.json.token = body.token;
      request(requestObject, (req, res, resBody) => {
        expect(resBody.status).toBe('unsuccessful');
        expect(res.statusCode).toBe(400);
        expect(resBody.message)
        .toBe('Could not find any user!');
        done();
      });
    });
  });
});

