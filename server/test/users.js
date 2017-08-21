import request from 'supertest';

import index from '../models';
import app from '../app';
import mockUsers, { superAdmin, admin } from '../mocks/users';

const expect = require('chai').expect;

describe('user controller:', () => {
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

  describe('signUp: ', () => {
    const userDetail = mockUsers[1];
    userDetail.userName = mockUsers[1].username;
    afterEach((done) => {
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

    it(`should Add user info to database when all form fields
    are correctly filled`, (done) => {
        request(app).post('/api/v1/users').send(userDetail).end((err, res) => {
          expect(res.body.status).to.equal('successful');
          expect(res.body.userName).to.equal('john');
          expect(res.body.email).to.equal('john@gmail.com');
          expect(res.body.roleType).to.equal('Fellow');
          expect(res.statusCode).to.equal(200);
          expect(res.body.token).to.not.be.null;
          done();
        });
      });

    it('should not create user that already exist', (done) => {
      request(app).post('/api/v1/users').send(userDetail).end(() => {
        request(app).post('/api/v1/users')
          .send(userDetail).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(400);
            expect(res.body.message).to.equal('User already exist');
            done();
          });
      });
    });

    it('should throw error when invalid form is posted', (done) => {
      request(app).post('/api/v1/users')
        .send({
          userName: 'jadofd',
          userEmail: '@mail.com'
        }).end((err, res) => {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.length).to.equal(2);
          done();
        });
    });

    it('should throw error when isactive status is not set', (done) => {
      request(app).post('/api/v1/users')
        .send({
          userName: 'jackson',
          email: 'jackson@gmail.com',
          password: 'testing1',
        }).end((err, res) => {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.includes('Set "isactive" property'))
            .to.equal(true);
          done();
        });
    });
  });

  describe('signIn: ', () => {
    const userDetail = mockUsers[1];
    userDetail.userName = mockUsers[1].username;
    beforeEach((done) => {
      request(app).post('/api/v1/users')
        .send(userDetail).end((err, res) => {
          userDetail.userId = res.body.userId;
          done();
        });
    });

    afterEach((done) => {
      userDetail.userName = 'john';
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
        request(app).post('/api/v1/users/login')
          .send(userDetail).end((err, res) => {
            expect(res.body.status).to.equal('successful');
            expect(res.body.userName).to.equal('john');
            expect(res.body.email).to.equal('john@gmail.com');
            expect(res.body.roleType).to.equal('Fellow');
            done();
          });
      });

    it('should throw error when user dont exist in the database', (done) => {
      const testUser = { userName: 'jacob', password: 'testing1' };
      request(app).post('/api/v1/users/login')
        .send(testUser).end((err, res) => {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.includes('Wrong username!')).to.equal(true);
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it(`should return valid error message when a
    deactivated user tries to signup`, (done) => {
        // deactivate user
        request(app).delete(`/api/v1/users/${userDetail.userId}`)
          .set({ token: superAdminToken }).end(() => {
            request(app).post('/api/v1/users/login')
              .send(userDetail).end((err, res) => {
                expect(res.body.status).to.equal('unsuccessful');
                expect(res.body.message).to.equal('user is inactive');
                expect(res.statusCode).to.equal(400);
                done();
              });
          });
      });

    it('should throw error when password is invalid', (done) => {
      request(app).post('/api/v1/users/login')
        .send({
          userName: userDetail.userName,
          password: 'saints'
        }).end((err, res) => {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message.includes('Wrong password!'))
            .to.equal(true);
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin a user when no password is inputed', (done) => {
      request(app).post('/api/v1/users/login')
        .send({
          userName: userDetail.userName,
          password: null
        }).end((err, res) => {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it('should not signin a user when no username is inputed', (done) => {
      request(app).post('/api/v1/users/login')
        .send({
          userName: undefined,
          password: 'testing1'
        }).end((err, res) => {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });
  });

  describe('viewProfile: ', () => {
    const userDetail = mockUsers[1];
    userDetail.userName = mockUsers[1].username;
    let userId;
    let token;
    beforeEach((done) => {
      request(app).post('/api/v1/users')
        .send(userDetail).end((err, res) => {
          userId = res.body.userId;
          token = res.body.token;
          done();
        });
    });

    afterEach((done) => {
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
        request(app).get(`/api/v1/users/${userId}`)
          .end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(400);
            expect(res.body.message).to.equal('You are not authenticated!');
            done();
          });
      });

    it('should fail when invalid token is passed', (done) => {
      const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC';
      request(app).get(`/api/v1/users/${userId}`)
        .set({ token: userToken }).end((err, res) => {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('You are not authenticated!');
          done();
        });
    });

    it('should return user detail when valid token is passed', (done) => {
      request(app).get(`/api/v1/users/${userId}`)
        .set({ token }).end((err, res) => {
          expect(res.body.status).to.equal('successful');
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should not allow other users to access a particular user\'s profile',
      (done) => {
        request(app).get(`/api/v1/users/${userId - 4}`)
          .set({ token }).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.body.message).to
              .equal('You cannot view another user\'s detail');
            expect(res.statusCode).to.equal(400);
            done();
          });
      });

    it('should return correct error message when userid is not a number',
      (done) => {
        request(app).get('/api/v1/users/a4')
          .set({ token }).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.body.message).to
              .equal('Error due to invalid user!');
            expect(res.statusCode).to.equal(400);
            done();
          });
      });

    it(`should prevent a deactivated user from viewing
    their profile`, (done) => {
        // deactivate user
        request(app).get(`/api/v1/users/${userDetail.userId}`)
          .set({ token: superAdminToken }).end(() => {
            request(app).get(`/api/v1/users/${userDetail.userId}`)
              .set({ token }).end((err, res) => {
                expect(res.body.status).to.equal('unsuccessful');
                expect(res.body.message).to.equal('Error due to invalid user!');
                expect(res.statusCode).to.equal(400);
                done();
              });
          });
      });
  });

  describe('getAll: ', () => {
    const userDetail = {
      userName: 'junior',
      email: 'junior@gmail.com',
      password: 'testing1',
      roleId: 3,
      isactive: true,
    };
    let userToken;
    const User = index.User;
    before((done) => {
      request(app).post('/api/v1/users')
        .send(userDetail).end((req, res) => {
          userToken = res.body.token;
          User.bulkCreate(mockUsers)
            .then(() => User.findAll()).then(() => {
              done();
            }).catch((err) => {
              done(err);
            });
        });
    });

    after((done) => {
      User.findOne({
        where: {
          username: userDetail.userName,
        }
      }).then((userFound) => {
        if (userFound) {
          userFound.destroy();
        }
        User.destroy({
          where: {
            roleId: { $notIn: [1, 2] },
          },
        });
        done();
      }).catch(() => {
        done();
      });
    });

    it('Should deny access to unauthenticated user from viewing all users',
      (done) => {
        request(app).get('/api/v1/users').set({}).end((err, res) => {
          expect(res.body.message).to.equal('You are not authenticated!');
          expect(res.body.status).to.equals('unsuccessful');
          done();
        });
      });

    it('Should deny a regular user from viewing all users route',
      (done) => {
        request(app).get('/api/v1/users').set({ token: userToken })
          .end((err, res) => {
            expect(res.body.message).to.equal('Access denied!');
            expect(res.body.status).to.equal('unsuccessful');
            done();
          });
      });

    it('Should allow admin to view all users in the database',
      (done) => {
        request(app).get('/api/v1/users').set({ token: adminToken })
          .end((err, res) => {
            expect(res.body.status).to.equal('successful');
            expect(res.statusCode).to.equal(200);
            expect(res.body.users.length).to.equal(8);
            done();
          });
      });

    it('Should allow superadmin to view all users in the database',
      (done) => {
        request(app).get('/api/v1/users?offset=4')
          .set({ token: superAdminToken })
          .end((err, res) => {
            expect(res.body.status).to.equal('successful');
            expect(res.statusCode).to.equal(200);
            expect(res.body.users.length).to.equal(5);
            done();
          });
      });

    it(`Should reset limit and offset to 8 and 0 respectively when
    they are not set`,
      (done) => {
        request(app).get('/api/v1/users?offset=null&limit=null')
          .set({ token: superAdminToken })
          .end((err, res) => {
            expect(res.body.status).to.equal('successful');
            expect(res.statusCode).to.equal(200);
            expect(res.body.users.length).to.equal(8);
            done();
          });
      });
  });

  describe.only('find: ', () => {
    const userDetail = mockUsers[0];
    userDetail.userName = mockUsers[0].username;
    let userToken;
    const User = index.User;
    before((done) => {
      request(app).post('/api/v1/users')
        .send(userDetail).end((req, res) => {
          userToken = res.body.token;
          User.bulkCreate(mockUsers)
            .then(() => User.findAll()).then(() => {
              // allUsers = users.map(user => user.dataValues);
              done();
            }).catch((err) => {
              done(err);
            });
        });
    });

    after((done) => {
      User.findOne({
        where: {
          username: userDetail.userName,
        }
      }).then((userFound) => {
        if (userFound) {
          userFound.destroy();
        }
        User.destroy({
          where: {
            roleId: { $notIn: [1, 2] },
          },
        });
        done();
      }).catch(() => {
        done();
      });
    });

    it(`Should deny access to unauthenticated user
    from searching through users`,
      (done) => {
        request(app).get('/api/v1/search/users')
          .end((err, res) => {
            expect(res.body.message).to.equal('You are not authenticated!');
            expect(res.body.status).to.equal('unsuccessful');
            done();
          });
      });

    it('Should deny a regular user from searching through users',
      (done) => {
        request(app).get('/api/v1/search/users?q=te&limit=8')
          .set({ token: userToken })
          .end((err, res) => {
            expect(res.body.message).to.equal('Access denied!');
            expect(res.body.status).to.equal('unsuccessful');
            done();
          });
      });

    it(`Should return an error message when a search request is
    sent without a search string`,
      (done) => {
        request(app).get('/api/v1/search/users?q=&limit=8')
          .set({ token: adminToken })
          .end((err, res) => {
            expect(res.body.message).to.equal('No username to search for!');
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(400);
            done();
          });
      });

    it('Should allow superadmin to search through users in the database',
      (done) => {
        request(app).get('/api/v1/search/users?q=r&offset=0')
          .set({ token: superAdminToken })
          .end((err, res) => {
            expect(res.body.status).to.equal('successful');
            expect(res.statusCode).to.equal(200);
            expect(res.body.users.length).to.equal(7);
            done();
          });
      });
  });

  describe('update: ', () => {
    const userDetail = mockUsers[1];
    beforeEach((done) => {
      request(app).post('/api/v1/users')
        .send(userDetail).end((err, res) => {
          userDetail.userId = res.body.userId;
          userDetail.token = res.body.token;
          done();
        });
    });

    afterEach((done) => {
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

    it(`should update a user's email successfully when their id
        is correct and their updated info is valid`,
      (done) => {
        request(app).put(`/api/v1/users/${userDetail.userId}`)
          .send({ email: 'newJohn@gmail.com' }).end((err, res) => {
            expect(res.body.status).to.equal('successful');
            expect(res.statusCode).to.equal(200);
            done();
          });
      });

    it('should not allow a user to update other user\'s profile',
      (done) => {
        request(app).put(`/api/v1/users/${userDetail.userId - 4}`)
          .send({ email: 'newJohn1@gmail.com' }).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(200);
            expect(res.body.message).to.equal('No user found!');
            done();
          });
      });

    it(`should fail to update a user's email when their id
    is correct and their updated email is invalid`,
      (done) => {
        request(app).put(`/api/v1/users/${userDetail.userId}`)
          .send({ email: 'newJohn1gmail.com' }).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(400);
            done();
          });
      });

    it('should fail to update a user\'s role unless by the superadmin',
      (done) => {
        request(app).put(`/api/v1/users/${userDetail.userId}`)
          .send({ roleId: 4 }).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(400);
            done();
          });
      });
  });

  describe('Delete: ', () => {
    const userDetail = mockUsers[1];
    let userToken;
    let userId;
    beforeEach((done) => {
      request(app).post('/api/v1/users')
        .send(userDetail).end((err, res) => {
          userId = res.body.userId;
          userToken = res.body.token;
          done();
        });
    });

    afterEach((done) => {
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

    it('should not deactivate a user when not logged in as admin', (done) => {
      request(app).delete(`/api/v1/users/${userId}`)
        .ser({ token: userToken }).end((err, res) => {
          expect(res.body.status).to.equal('unsuccessful');
          expect(res.body.message).to.equal('Access denied!');
          expect(res.statusCode).to.equal(400);
          done();
        });
    });

    it(`should return error message when an unauthenticated 
      user tries to deactivate a user`, (done) => {
        request(app).delete(`/api/v1/users/${userId}`)
          .ser({ token: `${userToken}sserede` }).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.body.message).to.equal('You are not authenticated!');
            expect(res.statusCode).to.equal(400);
            done();
          });
      });

    it(`should return error message when an admin enters 
    an invalid user id to deactivate`, (done) => {
        request(app).delete('/api/v1/users/8a')
          .set({ token: superAdminToken }).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(500);
            expect(res.body.message).to.equal('Invalid user ID!');
            done();
          });
      });

    it(`should allow admin to successfully deactivate
      a user`, (done) => {
        request(app).delete(`/api/v1/users/${userId}`)
          .set({ token: superAdminToken }).end((err, res) => {
            expect(res.body.status).to.equal('successful');
            expect(res.statusCode).to.equal(200);
            done();
          });
      });

    it(`should throw correct error message when
      superAdmin enters a user ID that isnt in the database`, (done) => {
        request(app).delete('/api/v1/users/1500')
          .set({ token: superAdminToken }).end((err, res) => {
            expect(res.body.status).to.equal('unsuccessful');
            expect(res.statusCode).to.equal(400);
            expect(res.body.message)
              .to.equal('Could not find any user!');
            done();
          });
      });
  });
});
