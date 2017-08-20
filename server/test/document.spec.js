import request from 'supertest';

import app from '../app';
import mockUsers from '../mocks/users';
import mockDocuments, { adminDocument } from '../mocks/documents';
import index from '../models';

const expect = require('chai').expect;

describe('Creating Document', () => {
  const userDetail = mockUsers[0];
  const userDocument = mockDocuments[0];
  let userToken;
  let userId;
  before((done) => {
    request(app).post('/api/v1/users').send(userDetail).end((err, res) => {
      userToken = res.body.token;
      userId = res.body.userId;
      done();
    });
  });

  beforeEach(() => {
    userDocument.title = mockDocuments[0].title;
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
    }).catch((err) => {
      done(err);
    });
  });

  it(`should not create a document with empty
  title`, (done) => {
    userDocument.title = '';
    userDocument.token = userToken;
    request(app).post('/api/v1/documents').send(userDocument)
    .end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Empty title or body or access field!');
      done();
    });
  });

  it(`should not create a document with empty
  body`, (done) => {
    userDocument.title = 'I want to play chess';
    userDocument.body = '';
    request(app).post('/api/v1/documents').send(userDocument)
    .end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Empty title or body or access field!');
      done();
    });
  });

  it(`should not create a document with empty
  access field`, (done) => {
    userDocument.body = 'Who asked you that question';
    userDocument.access = null;
    request(app).post('/api/v1/documents').send(userDocument)
    .end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Empty title or body or access field!');
      done();
    });
  });

  it(`should not create a document with no
  user token`, (done) => {
    userDocument.access = 'Private';
    userDocument.token = null;
    request(app).post('/api/v1/documents').send(userDocument)
    .end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('You are not authenticated!');
      done();
    });
  });

  it(`should create document when user is authenticated
  and is creating a valid document`, (done) => {
    userDocument.userId = userId;
    userDocument.token = userToken;
    userDocument.access = 'Private';
    request(app).post('/api/v1/documents').send(userDocument)
    .end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it(`should not create a document whose
  title already exists`, (done) => {
    request(app).post('/api/v1/documents').send(userDocument)
    .end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.statusCode).to.equal(400);
      expect(res.body.message).to.equal('Document already exist!');
      done();
    });
  });
});

describe('Finding a document', () => {
  const userDetail = mockUsers[0];
  const userDocument = mockDocuments[0];
  let userToken;
  let adminToken;
  let superAdminToken;
  let allDocuments;
  before((done) => {
    request(app).post('/api/v1/users').send(userDetail).end((err, res) => {
      userDocument.userId = res.body.userId;
      userDocument.token = res.body.token;
      userToken = res.body.token;
      request(app).post('/api/v1/users/login').send({
        userName: 'touchstone',
        password: 'testing1'
      }).end((err, res1) => {
        adminToken = res1.body.token;
        request(app).post('/api/v1/users/login').send({
          userName: 'SuperAdmin',
          password: 'testing1',
        }).end((err, res2) => {
          superAdminToken = res2.body.token;
          request(app).post('/api/v1/documents')
          .send(userDocument).end((err, res3) => {
            userDocument.docId = res3.body.documentId;
            const Document = index.Document;
            const newMockDocuments = mockDocuments.map((mockDocument) => {
              mockDocument.userId = res.body.userId;
              return mockDocument;
            });
            Document.bulkCreate(newMockDocuments)
              .then(() => Document.findAll()).then((documents) => {
                allDocuments = documents.map(document => document.dataValues);
                done();
              }).catch(() => {
                done();
              });
          });
        });
      });
    });
  });
  const User = index.User;
  after((done) => {
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
  it('should throw error for invalid document ID',
    (done) => {
      userDetail.token = userToken;
      request(app).get('/api/v1/document/2e')
      .set({ token: userToken })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message).to.equal('Invalid search parameter!');
        done();
      });
    });

  it('should throw error when document dont exist', (done) => {
    request(app).get('/api/v1/document/34534594')
    .set({ token: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body.message)
        .to.equal('An error coccured while loading your document!');
      expect(res.body.status).to.equal('unsuccessful');
      done();
    });
  });

  it('should allow access to a private document by its owner', (done) => {
    request(app).get(`/api/v1/document/${userDocument.docId}`)
    .set({ token: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it('should allow an admin user to access a private document', (done) => {
    request(app).get(`/api/v1/document/${userDocument.docId}`)
    .set({ token: adminToken })
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it('should allow a superadmin user to access a private document', (done) => {
    request(app).get(`/api/v1/document/${userDocument.docId}`)
    .set({ token: superAdminToken })
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it('should allow a user to access a public document', (done) => {
    request(app).get(`/api/v1/document/${allDocuments[0].id}`)
    .set({ token: userToken })
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it(`should allow a user to access rolebased
  documents if they are on the same role`,
    (done) => {
      userDocument.token = userToken;
      request(app).get(`/api/v1/document/${allDocuments[3].id}`)
      .set({ token: userToken })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

  it('should allow Admin to find any document', (done) => {
    request(app).get(`/api/v1/document/${allDocuments[5].id}`)
    .set({ token: adminToken })
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it('should allow SuperAdmin to find any document', (done) => {
    request(app).get(`/api/v1/document/${allDocuments[5].id}`)
    .set({ token: superAdminToken })
    .end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it(`should deny other users that are not admin or super admin
   from accessing a document they didnt create`, (done) => {
    request(app).post('/api/v1/users')
    .send({
      userName: 'testjackson',
      password: 'testing1',
      email: 'user1@gmail.com',
      roleId: 4,
      isactive: true,
    }).end((err, res) => {
      userToken = res.body.token;
      request(app).get(`/api/v1/document/${allDocuments[5].id}`)
      .set({ token: userToken })
      .end((err, res1) => {
        expect(res1.statusCode).to.equal(400);
        expect(res1.body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: 'testjackson',
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
    });
  });
});

describe('updating Document', () => {
  const userDetail = mockUsers[0];
  const userDocument = mockDocuments[0];
  const userDocumentUpdate = {
    title: 'Why I love myself as well',
    body: 'Because I show high spirit and devotion',
    access: 'Private',
  };
  let userToken;
  let adminToken;
  let superAdminToken;
  let allDocuments;
  before((done) => {
    request(app).post('/api/v1/users')
    .send(userDetail).end((err, res) => {
      userDocument.userId = res.body.userId;
      userDocument.token = res.body.token;
      userDocumentUpdate.userId = res.body.userId;
      userDocumentUpdate.token = res.body.token;
      userToken = res.body.token;
      request(app).post('/api/v1/users/login')
      .send({
        userName: 'touchstone',
        password: 'testing1',
      }).end((err, res1) => {
        adminToken = res1.body.token;
        request(app).post('/api/v1/users/login')
        .send({
          userName: 'SuperAdmin',
          password: 'testing1',
        }).end((err, res2) => {
          superAdminToken = res2.body.token;
          request(app).post('/api/v1/documents')
          .send(userDocument).end((err, res3) => {
            userDocument.docId = res3.body.documentId;
            const Document = index.Document;
            const newMockDocuments = mockDocuments.map((mockDocument) => {
              mockDocument.userId = res.body.userId;
              return mockDocument;
            });
            Document.bulkCreate(newMockDocuments)
              .then(() => Document.findAll()).then((documents) => {
                allDocuments = documents.map(document => document.dataValues);
                done();
              }).catch(() => {
                done();
              });
          });
        });
      });
    });
  });
  const User = index.User;
  after((done) => {
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
  it('should throw error when trying to update documents that dont exist',
    (done) => {
      request(app).put('/api/v1/documents/e67w')
      .send(userDocumentUpdate).end((err, res) => {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message)
        .to.equal('Could not find any document to update!');
        done();
      });
    });

  it(`should deny any user from editing a document they didn't
  create except for an admin or super admin`,
    (done) => {
      request(app).post('/api/v1/users')
      .send(mockUsers[2]).end((err, res) => {
        userDocumentUpdate.token = res.body.token;
        request(app).put(`/api/v1/documents/${allDocuments[2].id}`)
        .send(userDocumentUpdate).end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.message)
            .to.equal('Restricted document!');
          expect(res.body.status).to.equal('unsuccessful');
          User.findOne({
            where: {
              username: mockUsers[2].userName,
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
      });
    });

  it('should allow Admin to  edit a document they didnt create', (done) => {
    userDocumentUpdate.token = adminToken;
    request(app).put(`/api/v1/documents/${allDocuments[2].id}`)
    .send(userDocumentUpdate).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it('should allow SuperAdmin to edit a document they didnt create',
    (done) => {
      userDocumentUpdate.token = superAdminToken;
      request(app).put(`/api/v1/documents/${allDocuments[2].id}`)
      .send(userDocumentUpdate).end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        done();
      });
    });

  it(`should return an error message when a user trys
  to update a document with an empty form`,
    (done) => {
      userDocumentUpdate.token = userToken;
      userDocumentUpdate.title = '';
      userDocumentUpdate.body = '';
      userDocumentUpdate.access = '';
      request(app).put(`/api/v1/documents/${allDocuments[2].id}`)
      .send(userDocumentUpdate).end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message)
        .to.equal('No new value to update document!');
        done();
      });
    });
});

describe('Deleting a document', () => {
  const userDetail = mockUsers[0];
  const userDocument = mockDocuments[0];
  let allDocuments;
  let userToken;

  before((done) => {
    request(app).post('/api/v1/users')
    .send(userDetail).end((err, res) => {
      userDocument.userId = res.body.userId;
      userDocument.token = res.body.token;
      userToken = res.body.token;
      request(app).post('/api/v1/documents')
      .send(userDocument).end((err, res1) => {
        userDocument.docId = res1.body.documentId;
        const Document = index.Document;
        const newMockDocuments = mockDocuments.map((mockDocument) => {
          mockDocument.userId = res.body.userId;
          return mockDocument;
        });
        Document.bulkCreate(newMockDocuments)
          .then(() => Document.findAll()).then((documents) => {
            allDocuments = documents.map(document => document.dataValues);
            done();
          }).catch(() => {
            done();
          });
      });
    });
  });

  const User = index.User;
  after((done) => {
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
  it('should not allow an unauthenticated user to delete any document',
    (done) => {
      request(app).delete(`/api/v1/documents/${allDocuments[3].id}`)
      .set({ token: '' }).end((err, res) => {
        expect(res.body.status).to.equal('unsuccessful');
        expect(res.body.message).to.equal('You are not authenticated!');
        done();
      });
    });

  it('should fail to delete document with invalid ID', (done) => {
    request(app).delete('/api/v1/documents/52')
    .set({ token: userToken }).end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.message).to.equal('Could not find document!');
      done();
    });
  });

  it('should successfully delete a document owned by a user', (done) => {
    request(app).delete(`/api/v1/documents/${allDocuments[3].id}`)
    .set({ token: userToken }).end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.message)
      .to.equal('"Test spec document 2" has been deleted!');
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should not be able to delete another users document', (done) => {
    request(app).post('/api/v1/users')
    .send(mockUsers[5]).end((err, res1) => {
      userToken = res1.body.token;
      request(app).delete(`/api/v1/documents/${allDocuments[2].id}`)
      .set({ token: userToken }).end((req, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message)
          .to.equal('Access denied!');
        expect(res.body.status).to.equal('unsuccessful');
        User.findOne({
          where: {
            username: mockUsers[5].userName,
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
    });
  });
});

describe('getUserDocument', () => {
  const userDetail = mockUsers[0];
  const userDocument = mockDocuments[0];
  let userToken;
  let allDocuments;

  before((done) => {
    request(app).post('/api/v1/users').send(userDetail)
    .end((err, res) => {
      userDocument.userId = res.body.userId;
      userDocument.token = res.body.token;
      userToken = res.body.token;
      request(app).post('/api/v1/documents').send(userDocument)
      .end((err, res1) => {
        userDocument.docId = res1.body.documentId;
        const Document = index.Document;
        const newMockDocuments = mockDocuments.map((mockDocument) => {
          mockDocument.userId = res.body.userId;
          return mockDocument;
        });
        Document.bulkCreate(newMockDocuments)
          .then(() => Document.findAll()).then((documents) => {
            allDocuments = documents.map(document => document.dataValues);
            done();
          }).catch(() => {
            done();
          });
      });
    });
  });

  const User = index.User;
  after((done) => {
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

  it('should get all documents created by a given user',
  (done) => {
    request(app).get(`/api/v1/users/${userDocument.userId}/documents`)
    .set({ token: userToken }).end((req, res) => {
      expect(res.body.count).to.equal(allDocuments.length);
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it('should get documents based on the values of offset and limit given',
  (done) => {
    request(app)
    .get(`/api/v1/users/${userDocument.userId}/documents?offset=2&limit2`)
    .set({ token: userToken }).end((err, res) => {
      expect(res.body.documents.length).to.equal(6);
      expect(res.body.status).to.equal('successful');
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should notify a user when they have not created any document',
  (done) => {
    request(app).post('/api/v1/users')
    .send(mockUsers[3]).end((err, res1) => {
      userToken = res1.body.token;
      request(app)
      .get(`/api/v1/users/${res1.body.userId}/documents`)
      .set({ token: userToken }).end((req, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.message)
          .to.equal('No document found!');
        expect(res.body.status).to.equal('unsuccessful');
        done();
      });
    });
  });

  it(`should deny access to a user without admin rights
   who wants to view private
   documents belonging to other users`,
  (done) => {
    request(app)
    .get(`/api/v1/users/${userDocument.userId}/documents?offset=2`)
    .set({ token: userToken }).end((err, res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body.message)
          .to.equal('No document found!');
      expect(res.body.status).to.equal('unsuccessful');
      User.findOne({
        where: {
          username: mockUsers[3].userName,
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
  });

  it('should deny an unauthenticated user access to view all documents',
  (done) => {
    request(app).get('/api/v1/users/50/documents')
    .end((err, res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.message).to.equal('You are not authenticated!');
      done();
    });
  });
});

describe('getAll function', () => {
  const userDetail = mockUsers[0];
  const userDocument = mockDocuments[0];
  let userToken;
  let adminToken;
  let superAdminToken;
  let allDocuments;
  before((done) => {
    request(app).post('/api/v1/users')
    .send(userDetail).end((err, res) => {
      userDocument.userId = res.body.userId;
      userToken = res.body.token;
      request(app).post('/api/v1/users/login')
      .send({
        userName: 'touchstone',
        password: 'testing1',
      }).end((err, res1) => {
        adminToken = res1.body.token;
        request(app).post('/api/v1/users/login')
        .send({
          userName: 'SuperAdmin',
          password: 'testing1',
        }).end((err, res2) => {
          superAdminToken = res2.body.token;
          request(app).post('/api/v1/documents')
          .send(adminDocument).end((err, res3) => {
            adminDocument.docId = res3.body.documentId;
            const Document = index.Document;
            const newMockDocuments = mockDocuments.map((mockDocument) => {
              mockDocument.userId = res.body.userId;
              return mockDocument;
            });
            Document.bulkCreate(newMockDocuments)
              .then(() => Document.findAll()).then((documents) => {
                allDocuments = documents.map(document => document.dataValues);
                done();
              }).catch(() => {
                done();
              });
          });
        });
      });
    });
  });
  const User = index.User;
  const Document = index.Document;
  after((done) => {
    User.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      Document.findOne({
        where: {
          title: adminDocument.title,
        }
      }).then((documentFound) => {
        if (documentFound) {
          documentFound.destroy();
        }
        done();
      }).catch(() => {
        done();
      });
    }).catch(() => {
      done();
    });
  });

  it(`should deny an authenticated user except admin and superadmin
   access to get all documents`,
  (done) => {
    request(app).get('/api/v1/documents')
    .set({ token: userToken }).end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.count).not.to.equal(allDocuments.length);
      done();
    });
  });

  it(`should deny unauthenticated users form
  access to get all documents`,
 (done) => {
   request(app).get('/api/v1/documents')
   .end((err, res) => {
     expect(res.body.status).to.equal('unsuccessful');
     expect(res.body.message).to.equal('You are not authenticated!');
     done();
   });
 });

  it('should allow admin to get all documents in the database',
  (done) => {
    request(app).get('/api/v1/documents')
    .set({ token: adminToken }).end((err, res) => {
      expect(res.body.status).to.equal('successful');
      done();
    });
  });

  it('should allow superAdmin to get all documents in the database',
  (done) => {
    request(app).get('/api/v1/documents')
    .set({ token: superAdminToken }).end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(allDocuments.length);
      done();
    });
  });

  it('should allow superAdmin to get atmost 3 documents in the database',
  (done) => {
    request(app).get('/api/v1/documents?limit=3')
    .set({ token: superAdminToken }).end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(7);
      expect(res.body.documents.length).to.equal(3);
      done();
    });
  });

  it('should allow admin to get all documents from the 3rd document',
  (done) => {
    request(app).get('/api/v1/documents?offset=3')
    .set({ token: adminToken }).end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(7);
      expect(res.body.documents.length).to.equal(4);
      expect(res.body.documents[0].title)
      .to.equal('Test subordinate document 3');
      done();
    });
  });

  it('should allow a registered user to get all public documents',
  (done) => {
    request(app).get('/api/v1/documents/Public')
    .set({ token: userToken }).end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(1);
      expect(res.body.documents.length).to.equal(1);
      expect(res.body.documents[0].title)
      .to.equal('Test spec document 1');
      done();
    });
  });

  it('should allow a user to get all documents accessible to them',
  (done) => {
    request(app).get('/api/v1/documents/All')
    .set({ token: userToken }).end((req, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(7);
      expect(res.body.documents.length).to.equal(7);
      done();
    });
  });

  it('should allow a user to get all role documents accessible to them',
  (done) => {
    request(app).get('/api/v1/documents/Devops')
    .set({ token: userToken }).end((req, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(2);
      const roles = res.body.documents.map(document => document.access);
      expect(roles.includes('Learning')).to.equal(false);
      done();
    });
  });

  it('should not allow a user to view documents belonging to another role',
  (done) => {
    request(app).get('/api/v1/documents/Learning')
    .set({ token: userToken }).end((req, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.message).to.equal('Access denied!');
      done();
    });
  });

  it('should not allow a user to view documents belonging to another role',
  (done) => {
    request(app).get('/api/v1/documents/Fellow')
    .set({ token: userToken }).end((req, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.message).to.equal('Access denied!');
      done();
    });
  });

  it('should deny regular users from accessing Admin documents',
  (done) => {
    request(app).get('/api/v1/documents/Admin')
    .set({ token: userToken }).end((req, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.message).to.equal('Access denied!');
      done();
    });
  });
  let randomToken;
  it('should get only "fellow" documents from the database',
  (done) => {
    request(app).post('/api/v1/users')
    .send({
      userName: 'user',
      password: 'testing1',
      email: 'user1@gmail.com',
      roleId: 3,
      isactive: true,
    }).end((err, res1) => {
      randomToken = res1.body.token;
      request(app).get('/api/v1/documents/Fellow')
      .set({ token: randomToken }).end((req, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('successful');
        expect(res.body.documents.length).to.equal(1);
        done();
      });
    });
  });

  it('should deny users access to view documents belonging to other users',
  (done) => {
    request(app).get('/api/v1/documents/SuperAdmin?offset=2&limit=8')
    .set({ token: randomToken }).end((err, res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body.message)
          .to.equal('Access denied!');
      expect(res.body.status).to.equal('unsuccessful');
      User.findOne({
        where: {
          username: 'user',
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
  });

  it('should deny users access to view documents belonging to other users',
  (done) => {
    request(app).get('/api/v1/documents/SuperAdmin')
    .set({ token: superAdminToken }).end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.message).to.equal('No document found!');
      done();
    });
  });
});

describe('search function', () => {
  const userDetail = mockUsers[0];
  const userDocument = mockDocuments[0];
  let userToken;
  let adminToken;
  let superAdminToken;
  before((done) => {
    request(app).post('/api/v1/users').send(userDetail)
    .end((err, res) => {
      userDocument.userId = res.body.userId;
      userDocument.token = res.body.token;
      userToken = res.body.token;
      // create an admin user
      request(app).post('/api/v1/users/login')
      .send({
        userName: 'touchstone',
        password: 'testing1',
      }).end((err, res1) => {
        adminToken = res1.body.token;
        // login as superadmin
        request(app).post('/api/v1/users/login')
        .send({
          userName: 'SuperAdmin',
          password: 'testing1',
        }).end((err, res2) => {
          superAdminToken = res2.body.token;
          // create a document by an admin account
          request(app).post('/api/v1/users/login')
          .send(adminDocument).end((err, res3) => {
            adminDocument.docId = res3.body.documentId;
            const Document = index.Document;
            const newMockDocuments = mockDocuments.map((mockDocument) => {
              mockDocument.userId = res.body.userId;
              return mockDocument;
            });
            Document.bulkCreate(newMockDocuments)
              .then(() => Document.findAll()).then(() => {
                done();
              }).catch(() => {
                done();
              });
          });
        });
      });
    });
  });
  const User = index.User;
  const Document = index.Document;
  after((done) => {
    User.findOne({
      where: {
        username: userDetail.userName,
      }
    }).then((userFound) => {
      if (userFound) {
        userFound.destroy();
      }
      Document.findOne({
        where: {
          title: adminDocument.title,
        }
      }).then((documentFound) => {
        if (documentFound) {
          documentFound.destroy();
        }
        done();
      }).catch(() => {
        done();
      });
    }).catch(() => {
      done();
    });
  });

  it(`should return correct error message when no search text is passed
  to the server`,
  (done) => {
    request(app).get('/api/v1/search/documents')
    .set({ token: userToken }).end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.message).to.equal('No title to search for!');
      done();
    });
  });

  it(`should deny unauthenticated users from searching for
  any document`,
 (done) => {
   request(app).get('/api/v1/search/documents?q=the')
   .end((err, res) => {
     expect(res.body.status).to.equal('unsuccessful');
     expect(res.body.message).to.equal('You are not authenticated!');
     done();
   });
 });

  it('should return an explanatory message when there is no match',
  (done) => {
    request(app).get('/api/v1/search/documents?q=the')
    .set({ token: adminToken })
    .end((err, res) => {
      expect(res.body.status).to.equal('unsuccessful');
      expect(res.body.message).to.equal('No match found!');
      done();
    });
  });

  it('should allow admin to search through all documents in the database',
  (done) => {
    request(app).get('/api/v1/search/documents?q=main sub&limit=8')
    .set({ token: adminToken })
    .end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(2);
      done();
    });
  });

  it('should allow superAdmin to search through all documents in the database',
  (done) => {
    request(app).get('/api/v1/search/documents?q=main sub&limit=8')
    .set({ token: superAdminToken })
    .end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(2);
      done();
    });
  });

  it('should allow a regular user search through documents accessible to them',
  (done) => {
    request(app)
    .get('/api/v1/search/documents?q=main document&limit=8&offset=0')
    .set({ token: userToken })
    .end((err, res) => {
      expect(res.body.status).to.equal('successful');
      expect(res.body.count).to.equal(6);
      const docTitles = res.body.documents.map(document => document.title);
      expect(docTitles.includes('Admin Document')).to.equal(false);
      done();
    });
  });
});
