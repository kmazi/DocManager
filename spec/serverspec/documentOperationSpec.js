import request from 'request';

import index from '../../server/models';
import { createToken } from
  '../../server/controller/middlewares/validation';

const routeUrl = 'http://localhost:1844/api/v1';
const docUrl = `${routeUrl}/documents`;
let userDetail = {
  userName: 'jackson',
  email: 'jackson@gmail.com',
  password: 'testing1',
  roleId: 2,
  userId: 0,
  token: '',
};

const userDocument = {
  title: 'Why I love team Gimli.',
  body: 'Team gimli shows high spirit and devotion',
  access: 'Public',
  userId: userDetail.userId,
  token: userDetail.token,
};

describe('createDocument()', () => {
  userDetail = {
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
        url: docUrl,
        method: 'POST',
        json: userDocument,
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
    }).catch();
  });

  it(`should create document when user is authenticated
  and is creating a valid document`, (done) => {
    requestObject.json.token = userDetail.token;
    requestObject.json.userId = userDetail.userId;
    request(requestObject, (req, res, body) => {
      expect(body.status).toBe('successful');
      expect(body.message).toBeUndefined();
      done();
    });
  });

  it(`should not create a document whose
  title already exists`, (done) => {
    requestObject.json.token = userDetail.token;
    requestObject.json.userId = userDetail.userId;
    request(requestObject, () => {
      request(requestObject, (req, res, body1) => {
        expect(body1.status).toBe('unsuccessful');
        expect(res.statusCode).toBe(400);
        expect(body1.message).toBe('Document already exist!');
        done();
      });
    });
  });

  it(`should not create a document with empty
    title`, (done) => {
    requestObject.json.token = userDetail.token;
    requestObject.json.userId = userDetail.userId;
    requestObject.json.title = '';
    request(requestObject, (req, res, body1) => {
      expect(body1.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      expect(body1.message).toBe('Empty title or body or access field!');
      done();
    });
  });

  it(`should not create a document with empty
    access field`, (done) => {
    requestObject.json.token = userDetail.token;
    requestObject.json.userId = userDetail.userId;
    requestObject.json.access = '';
    request(requestObject, (req, res, body1) => {
      expect(body1.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      expect(body1.message).toBe('Empty title or body or access field!');
      done();
    });
  });

  it(`should not create a document with invalid
    user token`, (done) => {
    requestObject.json.token = `skjdjisfdifdsofifds.dlsdfsdisiod
    .dfiosoidfsdfdfdijsf`;
    requestObject.json.access = 'Private';
    request(requestObject, (req, res, body1) => {
      expect(body1.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      expect(body1.message).toBe('You are not authenticated!');
      done();
    });
  });

  it(`should not create a document with no
    user token`, (done) => {
    requestObject.json.token = '';
    requestObject.json.access = 'Private';
    request(requestObject, (req, res, body1) => {
      expect(body1.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      expect(body1.message).toBe('You are not authenticated!');
      done();
    });
  });

  it(`should not create a document with no
    user token`, (done) => {
    requestObject.json.token = createToken({
      userName: 'james',
      password: 'testing1',
      access: 'Private',
    });
    requestObject.json.access = 'Private';
    request(requestObject, (req, res, body1) => {
      expect(body1.status).toBe('unsuccessful');
      expect(res.statusCode).toBe(400);
      expect(body1.message).toBe('No user found!');
      done();
    });
  });
});

describe('getAllDocuments()', () => {
  userDetail = {
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
        url: docUrl,
        method: 'POST',
        json: userDocument,
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
    }).catch();
  });

  it('', () => {

  });
});

describe('findDocument()', () => {
  userDetail = {
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
      userDocument.token = userDetail.token;
      userDocument.userId = userDetail.userId;
      requestObject = {
        url: docUrl,
        method: 'POST',
        json: userDocument,
      };
      request(requestObject, (req, res, body1) => {
        requestObject.json.documentId = body1.documentId;
        done();
      });
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
    }).catch();
  });

  fit('finds a document that exists and belongs to the searching user', (done) => {
    requestObject.method = 'GET';
    requestObject.url = `${docUrl}/${requestObject.json.documentId}`;
    console.log(requestObject, '........', requestObject.url, '....');
    request(requestObject, (req, res, body) => {
      expect(res.statusCode).toBe(200);
      expect(body.document).not.toBeUndefined();
      done();
    });
  });

  it('should fail when invalid document id is passed', (done) => {
    requestObject.method = 'GET';
    requestObject.url = `${docUrl}/34534594`;
    request(requestObject, (req, res, body) => {
      expect(res.statusCode).toBe(400);
      expect(body.message).toBe('Could not find any document!');
      expect(body.status).toBe('unsuccessful');
      done();
    });
  });
});
