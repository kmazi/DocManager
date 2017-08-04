import request from 'request';
import index from '../../server/models';
import {
  generalValidation, validateEmail,
  createToken, validatePassword
} from
  '../../server/controller/middlewares/validation';

const routeUrl = 'http://localhost:1844/api/v1';
describe('generalValidation()', () => {
  it('should throw error when script char (<,>) is used', () => {
    const user =
    generalValidation('<script>alert(\'I Love you\')</script>', 'username');
    expect(user.status).toBe('unsuccessful');
    expect(user.message.includes('\nInvalid input character(s)'))
    .toBe(true);
  });

  it('should pass when no script char (<,>) is used', () => {
    const user = generalValidation('testing1');
    expect(user.status).toBe('successful');
    expect(user.message.includes('\nInvalid input character(s)')).toBe(false);
  });

  it('should throw error when user field is empty', () => {
    const user = generalValidation('', 'username');
    expect(user.status).toBe('unsuccessful');
    expect(user.message.includes('\nEmpty or undefined username field!'))
      .toBe(true);
  });

  it('should not throw error when user field is correctly filled', () => {
    const user = generalValidation('peace', 'password');
    expect(user.status).toBe('successful');
    expect(user.message.length).toBe(0);
  });

  it('Should throw error when null or undefined value is submitted', () => {
    let user = generalValidation(null, 'username');
    expect(user.status).toBe('unsuccessful');
    expect(user.message.includes('\nEmpty or undefined username field!'))
      .toBe(true);
    user = generalValidation(undefined, 'password');
    expect(user.status).toBe('unsuccessful');
    expect(user.message.includes('\nEmpty or undefined password field!'))
      .toBe(true);
  });
});

describe('validateEmail()', () => {
  it('Should accept correct emails', () => {
    let email = validateEmail('kingsleyu13@gmail.com');
    expect(email.status).toBe('successful');
    email = validateEmail('chima.eze.go@lycos.com.ng');
    expect(email.status).toBe('successful');
  });

  it('Should reject incorrect emails', () => {
    let email = validateEmail('kingsleyu13gmail.com');
    expect(email.status).toBe('unsuccessful');
    email = validateEmail('fich@jame@gmail.com');
    expect(email.status).toBe('unsuccessful');
    email = validateEmail('fichame@yahoo.co.uk');
    expect(email.status).toBe('successful');
  });

  it('Should return correct error message when email validation fails', () => {
    const email = validateEmail('yuuuuuu.com');
    expect(email.status).toBe('unsuccessful');
    expect(email.message.includes('\nEmail has got wrong format')).toBe(true);
  });

  it('should throw error when empty', () => {
    const email = validateEmail('');
    expect(email.status).toBe('unsuccessful');
  });
});

describe('validatePassword:', () => {
  it('should be at least 6 characters', () => {
    let password = validatePassword('testi');
    expect(password.status).toBe('unsuccessful');
    expect(password.message.includes(
      '\nPassword length must be between 6 and 20')).toBe(true);
    password = validatePassword('testin');
    expect(password.status).toBe('successful');
  });

  it('should be at most 20 characters', () => {
    const password = validatePassword('testikhdhfh68dskksdhflfs9878s9ss');
    expect(password.status).toBe('unsuccessful');
    expect(password.message.includes(
      '\nPassword length must be between 6 and 20')).toBe(true);
  });

  it('should be between 6 and 20 both inclusive characters', () => {
    const password = validatePassword('merrymaking');
    expect(password.status).toBe('successful');
    expect(password.message.includes(
      '\nPassword length must be between 6 and 20')).toBe(false);
  });

  it('should not display error message when no input is found', () => {
    const password = validatePassword('');
    expect(password.status).toBe('unsuccessful');
    expect(password.message.includes(
      '\nPassword length must be between 6 and 20')).not.toBe(true);
  });
});

describe('SignIn and SignUp validation: ', () => {
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
  beforeEach((done) => {
    request(requestObject, (req, res, body) => {
      userDetail = {
        userName: 'jackson',
        email: 'jackson@gmail.com',
        password: 'testing1',
        roleId: 2,
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
    userDetail.roleId = 2;
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

  describe('SignInValidation()', () => {
    beforeEach(() => {
      requestObject.url = `${routeUrl}/users/login`;
    });
    it('Should return error message when empty form is sent', (done) => {
      requestObject.json = {};
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(res.statusCode).toBe(400);
        expect(body.message.includes('\nEmpty forms are not allowed!'))
          .toBe(true);
        done();
      });
    });

    it('Should move to the next function when form submitted is valid',
      (done) => {
        requestObject.url = `${routeUrl}/users`;
        request(requestObject, () => {
          requestObject.url = `${routeUrl}/users/login`;
          request(requestObject, (req, res, body) => {
            expect(body.status).toBe('successful');
            done();
          });
        });
      });

    it('Should throw correct error message when password has a wrong format',
      (done) => {
        requestObject.json.password = '';
        request(requestObject, (req, res, body) => {
          expect(body.status).toBe('unsuccessful');
          expect(res.statusCode).toBe(400);
          expect(body.message
            .includes('\nPassword length must be between 6 and 20'))
            .toBe(false);
          expect(body.message
            .includes('\nWrong password')).toBe(true);
          done();
        });
      });

    it('Should throw correct error message when username has a wrong format',
      (done) => {
        requestObject.json.userName = '';
        request(requestObject, (req, res, body) => {
          expect(body.status).toBe('unsuccessful');
          expect(res.statusCode).toBe(400);
          expect(body.message
            .includes('Empty or undefined fields are not allowed'))
            .toBe(true);
          done();
        });
      });
  });

  describe('SignUpValidation()', () => {
    // function to run before all tests
    beforeEach(() => {
      requestObject.url = `${routeUrl}/users`;
      requestObject.json = userDetail;
    });

    it('should throw error when nothing is submitted', (done) => {
      requestObject.json = {};
      request(requestObject, (req, res, body) => {
        expect(body.status).toBe('unsuccessful');
        expect(body.message[0]).toBe('Empty fields are not allowed');
        expect(res.statusCode).toBe(400);
        done();
      });
    });

    it('Should move on to the next function when form is valid',
      (done) => {
        request(requestObject, (req, res, body) => {
          expect(body.status).not.toBe('unsuccessful');
          done();
        });
      });

    it('Should return an error message when username is not filled',
      (done) => {
        requestObject.json.userName = '';
        request(requestObject, (req, res, body) => {
          expect(res.statusCode).toBe(400);
          expect(body.status).toBe('unsuccessful');
          expect(body.message
            .includes('Empty or undefined fields are not allowed')
          ).toBe(true);
          done();
        });
      });
  });
});

describe('createToken()', () => {
  it('should return a token as string when called', () => {
    const user = {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      roleId: '1',
    };
    expect(typeof createToken(user)).toBe('string');
  });

  it('should return a valid error message when no payload is passed', () => {
    expect(createToken()).toBe('No payload to create token');
  });
});

describe('verifyToken', () => {
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
  beforeEach((done) => {
    request(requestObject, (req, res, body) => {
      userDetail = {
        userName: 'jackson',
        email: 'jackson@gmail.com',
        password: 'testing1',
        roleId: 2,
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
    userDetail.roleId = 2;
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

  it('should authenticate the request when valid token is used',
    (done) => {
      requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
      requestObject.method = 'GET';
      request(requestObject, (req, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(body.status).toBe('successful');
        done();
      });
    });

  it(`should not authenticate request when 
  unknown user info is embedded in token`, (done) => {
    const token = createToken({
      userName: 'james',
      password: 'testing',
      email: 'jamaes@yahoo.com',
    });
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'GET';
    requestObject.json.token = token;
    request(requestObject, (req, res, body) => {
      expect(body.message).toBe('No user found!');
      expect(res.statusCode).toBe(400);
      expect(body.status).toBe('unsuccessful');
      done();
    });
  });

  it('should move to next function when user detail is correct', (done) => {
    requestObject.url = `${routeUrl}/users/${userDetail.userId}`;
    requestObject.method = 'GET';
    request(requestObject, (req, res, body) => {
      expect(body.message).not.toBe('No user found!');
      done();
    });
  });
});

describe('allowOnlyAdmin()', () => {
  const userDetail = {
    userName: 'touchstone',
    password: 'testing1',
    email: 'touchstone@gmail.com',
    roleId: 1,
  };
  const url = `${routeUrl}/users/login`;
  const requestObject = {
    url,
    method: 'POST',
    json: {
      userName: 'touchstone',
      password: 'testing1',
    }
  };
  const signupRequest = {
    url: `${routeUrl}/users`,
    method: 'POST',
    json: {
      userName: 'jackson',
      email: 'jackson@gmail.com',
      password: 'testing1',
      roleId: 2,
      isactive: true,
    }
  };
  let newToken = '';
  beforeEach((done) => {
    request(requestObject, (req, res, body) => {
      userDetail.token = body.token;
      userDetail.userId = body.userId;
      userDetail.roleType = body.roleType;
      request(signupRequest, (req, res, signUpBody) => {
        newToken = signUpBody.token;
        done();
      });
    });
  });

  afterEach((done) => {
    userDetail.userName = 'jackson';
    userDetail.password = 'testing1';
    const user = index.User;
    user.findOne({
      where: {
        username: signupRequest.json.userName,
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

  it('Should allow only admin navigate to the next route',
    (done) => {
      requestObject.json = userDetail;
      requestObject.url = `${routeUrl}/search/users`;
      requestObject.method = 'GET';
      request(requestObject, (req, res, body) => {
        expect(body.message).not.toBe('Access denied!');
        done();
      });
    });

  it('should deny access to other users that are not admin', (done) => {
    requestObject.json.token = newToken;
    requestObject.url = `${routeUrl}/search/users`;
    requestObject.method = 'GET';
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('unsuccessful');
      expect(body.message).toBe('Access denied!');
      done();
    });
  });
});
