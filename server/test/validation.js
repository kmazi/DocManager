import request from 'supertest';

import app from '../app';
import { superAdmin, admin, testUser } from '../mocks/users';
import index from '../../server/models';
import {
  generalValidation, validateEmail,
  createToken, validatePassword
} from
  '../../server/middlewares/validation';

const expect = require('chai').expect;

describe('Validation functions:', () => {
  let superAdminToken;
  let adminToken;
  before((done) => {
    // login admin account
    request(app).post('/api/v1/users/login')
      .send(admin).end((err, res) => {
        adminToken = res.body.token;
        done();
      });
  });

  before((done) => {
    // login superadmin account
    request(app).post('/api/v1/users/login')
      .send(superAdmin).end((err, res) => {
        superAdminToken = res.body.token;
        done();
      });
  });

  describe('generalValidation()', () => {
    it('should throw error when script char (<,>) is used', () => {
      const user =
        generalValidation('<script>alert(\'I Love you\')</script>', 'username');
      expect(user.status).to.equal('unsuccessful');
      expect(user.message.includes('\nInvalid input character(s)'))
        .to.equal(true);
    });

    it('should pass when no script char (<,>) is used', () => {
      const user = generalValidation('testing1');
      expect(user.status).to.equal('successful');
      expect(user.message.includes('\nInvalid input character(s)'))
        .to.equal(false);
    });

    it('should throw error when user field is empty', () => {
      const user = generalValidation('', 'username');
      expect(user.status).to.equal('unsuccessful');
      expect(user.message.includes('\nEmpty or invalid username field!'))
        .to.equal(true);
    });

    it('should not throw error when user field is correctly filled', () => {
      const user = generalValidation('peace', 'password');
      expect(user.status).to.equal('successful');
      expect(user.message.length).to.equal(0);
    });

    it('Should throw error when null or undefined value is submitted', () => {
      let user = generalValidation(null, 'username');
      expect(user.status).to.equal('unsuccessful');
      expect(user.message.includes('\nEmpty or invalid username field!'))
        .to.equal(true);
      user = generalValidation(undefined, 'password');
      expect(user.status).to.equal('unsuccessful');
      expect(user.message.includes('\nEmpty or invalid password field!'))
        .to.equal(true);
    });
  });

  describe('validateEmail()', () => {
    it('Should accept correct emails', () => {
      let email = validateEmail('kingsleyu13@gmail.com');
      expect(email.status).to.equal('successful');
      email = validateEmail('chima.eze.go@lycos.com.ng');
      expect(email.status).to.equal('successful');
    });

    it('Should reject incorrect emails', () => {
      let email = validateEmail('kingsleyu13gmail.com');
      expect(email.status).to.equal('unsuccessful');
      email = validateEmail('fich@jame@gmail.com');
      expect(email.status).to.equal('unsuccessful');
      email = validateEmail('fichame@yahoo.co.uk');
      expect(email.status).to.equal('successful');
    });

    it('Should return correct error message when email validation fails', () => {
      const email = validateEmail('yuuuuuu.com');
      expect(email.status).to.equal('unsuccessful');
      expect(email.message.includes('\nEmail has got wrong format'))
        .to.equal(true);
    });

    it('should throw error when empty', () => {
      const email = validateEmail('');
      expect(email.status).to.equal('unsuccessful');
    });
  });

  describe('validatePassword:', () => {
    it('should be at least 6 characters', () => {
      let password = validatePassword('testi');
      expect(password.status).to.equal('unsuccessful');
      expect(password.message.includes(
        '\nPassword length must be between 6 and 20')).to.equal(true);
      password = validatePassword('testin');
      expect(password.status).to.equal('successful');
    });

    it('should be at most 20 characters', () => {
      const password = validatePassword('testikhdhfh68dskksdhflfs9878s9ss');
      expect(password.status).to.equal('unsuccessful');
      expect(password.message.includes(
        '\nPassword length must be between 6 and 20')).to.equal(true);
    });

    it('should be between 6 and 20 both inclusive characters', () => {
      const password = validatePassword('merrymaking');
      expect(password.status).to.equal('successful');
      expect(password.message.includes(
        '\nPassword length must be between 6 and 20')).to.equal(false);
    });

    it('should not display error message when no input is found', () => {
      const password = validatePassword('');
      expect(password.status).to.equal('unsuccessful');
      expect(password.message.includes(
        '\nPassword length must be between 6 and 20')).to.equal(false);
    });
  });

  describe('SignIn and SignUp validation: ', () => {
    const userDetail = testUser;

    describe('SignInValidation()', () => {
      before((done) => {
        request(app).post('/api/v1/users')
          .send(userDetail).end(() => {
            done();
          });
      });

      after((done) => {
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

      it('Should return error message when empty form is sent', (done) => {
        request(app).post('/api/v1/users/login')
          .send({}).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(400);
            expect(res.body.message.includes('\nEmpty forms are not allowed!'))
              .to.equal(true);
            done();
          });
      });

      it('Should move to the next function when form submitted is valid',
        (done) => {
          request(app).post('/api/v1/users/login')
            .send(userDetail).end((err, res) => {
              expect(res.body.status).to.equal('successful');
              done();
            });
        });

      it('Should throw correct error message when username has a wrong format',
        (done) => {
          request(app).post('/api/v1/users/login')
            .send({
              userName: '',
              password: 'testing1'
            }).end((err, res) => {
              expect(res.body.status).to.equal('unsuccessful');
              expect(res.statusCode).to.equal(400);
              expect(res.body.message
                .includes('\nEmpty or invalid username field!'))
                .to.equal(true);
              done();
            });
        });

      it('Should throw an error message when password is wrong',
        (done) => {
          request(app).post('/api/v1/users/login')
            .send({
              userName: userDetail.userName,
              password: 'dsf'
            }).end((req, res) => {
              expect(res.body.status).to.equal('unsuccessful');
              expect(res.statusCode).to.equal(400);
              expect(res.body.message[0]).to.equal('\nWrong password');
              done();
            });
        });
    });

    describe('SignUpValidation()', () => {
      after((done) => {
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

      it('should throw error when nothing is submitted', (done) => {
        request(app).post('/api/v1/users')
          .send({}).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.body.message.includes('\nEmpty fields are not allowed'))
              .to.equal(true);
            expect(res.statusCode).to.equal(400);
            done();
          });
      });
      const randomUser = {
        userName: 'jupiter',
        password: '',
        email: 'jupiter@gmai.com',
        isactive: true,
        roleId: 4,
      };
      it('Should return an error message when username is not filled',
        (done) => {
          randomUser.userName = '';
          request(app).post('/api/v1/users')
            .send(randomUser).end((err, res) => {
              expect(res.statusCode).to.equal(400);
              expect(res.body.status).to.equal('unsuccessful');
              expect(res.body.message
                .includes('\nEmpty or invalid username field!')
              ).to.equal(true);
              done();
            });
        });

      it('Should return an error message when password textbox is not filled',
        (done) => {
          request(app).post('/api/v1/users')
            .send(randomUser).end((err, res) => {
              expect(res.statusCode).to.equal(400);
              expect(res.body.status).to.equal('unsuccessful');
              expect(res.body.message
                .includes('\nEmpty or invalid password field!')
              ).to.equal(true);
              done();
            });
        });

      it('Should return an error message when invalid email is sent',
        (done) => {
          randomUser.email = 'jackson.com';
          request(app).post('/api/v1/users')
            .send(randomUser).end((req, res) => {
              expect(res.statusCode).to.equal(400);
              expect(res.body.status).to.equal('unsuccessful');
              expect(res.body.message
                .includes('\nEmail has got wrong format')
              ).to.equal(true);
              done();
            });
        });

      it('Should throw error when signup as admin or superadmin',
        (done) => {
          randomUser.roleId = 2;
          randomUser.userName = 'janet';
          randomUser.email = 'janet@gmail.com';
          randomUser.password = 'testingw';
          randomUser.isactive = true;
          request(app).post('/api/v1/users')
            .send(randomUser).end((req, res) => {
              expect(res.statusCode).to.equal(400);
              expect(res.body.status).to.equal('unsuccessful');
              expect(res.body.message
                .includes('\nInvalid role!')
              ).to.equal(true);
              done();
            });
        });

      it('Should move on to the next function when form is valid',
        (done) => {
          request(app).post('/api/v1/users')
            .send(userDetail).end((req, res) => {
              expect(res.statusCode).to.equal(200);
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
      expect(typeof createToken(user)).to.equal('string');
    });

    it('should return a valid error message when no payload is passed', () => {
      expect(createToken()).to.equal('No payload to create token');
    });
  });

  describe('verifyToken', () => {
    const userDetail = testUser;
    before((done) => {
      request(app).post('/api/v1/users')
        .send(userDetail).end((req, res) => {
          userDetail.userId = res.body.userId;
          userDetail.token = res.body.token;
          done();
        });
    });

    after((done) => {
      const User = index.User;
      User.findOne({
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

    it('should authenticate the request when valid token is used',
      (done) => {
        request(app).get(`/api/v1/users/${userDetail.userId}`)
          .set({ token: userDetail.token }).end((req, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body.status).to.equal('successful');
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
      request(app).get(`/api/v1/users/${userDetail.userId}`)
          .set({ token }).end((req, res) => {
            expect(res.body.message).to.equal('No user found!');
            expect(res.statusCode).to.equal(400);
            expect(res.body.status).to.equal('unsuccessful');
            done();
          });
    });

    it(`should show correct error message when accessing
    protected route without token`, (done) => {
      request(app).get(`/api/v1/users/${userDetail.userId}`)
          .end((req, res) => {
            expect(res.body.message).to.equal('You are not authenticated!');
            done();
          });
    });
  });

  describe('isAdmin()', () => {
    const signUpUser = testUser;
    let newToken = '';
    before((done) => {
      request(app).post('/api/v1/users')
        .send(signUpUser).end((req, res) => {
          newToken = res.body.token;
          done();
        });
    });

    after((done) => {
      const user = index.User;
      user.findOne({
        where: {
          username: signUpUser.userName,
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

    it('Should allow admin navigate to the next route',
      (done) => {
        request(app).get('/api/v1/search/users?q=t')
        .set({ token: adminToken }).end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.paginationMetaData.pageSize).to.equal(1);
          done();
        });
      });

    it('should deny access to other users that are not admin', (done) => {
      request(app).get('/api/v1/search/users')
      .set({ token: newToken }).end((err, res) => {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Access denied!');
        done();
      });
    });

    it('Should allow SuperAdmin navigate to the next route',
      (done) => {
        request(app).get('/api/v1/search/users?q=t')
        .set({ token: superAdminToken }).end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
      });
  });

  describe('isSuperAdmin()', () => {
    const signupRequest = testUser;
    let newToken = '';
    beforeEach((done) => {
      request(app).post('/api/v1/users')
      .send(signupRequest).end((req, res) => {
        newToken = res.body.token;
        done();
      });
    });

    afterEach((done) => {
      const user = index.User;
      user.findOne({
        where: {
          username: signupRequest.userName,
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

    it('Should allow superAdmin navigate to the next route to create a role',
      (done) => {
        request(app).post('/api/v1/role')
        .send({ roletype: 'Testers' })
        .set({ token: superAdminToken })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('successful');
          request(app).delete(`/api/v1/role/${res.body.role.id}`)
          .set({ token: superAdminToken }).end(() => {
            done();
          });
        });
      });

    it('should deny access to other users that are not superadmin', (done) => {
      request(app).post('/api/v1/role')
      .send({ roletype: 'Testers' })
      .set({ token: newToken })
      .end((req, res) => {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('Access denied!');
        done();
      });
    });

    it('should not allow an admin to create a role', (done) => {
      request(app).post('/api/v1/role')
        .send({ roletype: 'Testers' })
        .set({ token: adminToken })
        .end((err, res) => {
          expect(res.body.message).to.equal('Access denied!');
          expect(res.body.status).to.equal('unsuccessful');
          done();
        });
    });
  });
});
