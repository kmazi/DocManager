import request from 'request';
import index from '../../server/models';

describe('The app route', () => {
  let userInfo = {};
  const url = 'http://localhost:1844/';

  beforeAll(() => {
    userInfo = {
      title: 'I love programming in python',
      body: 'Javascript is frustrating, but cannot say the same for python.',
      access: 'private',
      userId: '6',
    };
  });

  afterAll((done) => {
    const document = index.Document;
    document.destroy({
      where: {
        title: 'I love programming in python',
      }
    }).then(() => {
      done();
    });
  });

  afterEach(() => {
    userInfo = {
      title: 'I love programming in python',
      body: 'Javascript is frustrating, but cannot say the same for python.',
      access: 'private',
      userId: '132',
    };
  });

  it('should return a status code of 200 when the default root is called',
    (done) => {
      const endPoint = url;
      request.get(endPoint, (error, response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

  it('should fire the error route callback when no route is matched',
    (done) => {
      const endPoint = `${url}getball`;
      request.get(endPoint, (error, response, body) => {
        expect(body).toBe(`404 error has occured! The page you're 
      searching for cannot be found`);
        expect(response.statusCode).toBe(404);
        done();
      });
    });

  it('should return successful when document is successfully created',
    (done) => {
      const endPoint = `${url}documents`;
      request({
        url: endPoint,
        method: 'POST',
        json: userInfo,
      }, (err, res, body) => {
        expect(body).toBe('successful');
        done();
      });
    });

  it('should not hit the database to save anything when empty form is sent',
    (done) => {
      // create the endpoint url
      const endPoint = `${url}documents`;
      // empty the form and send the request
      userInfo = {
        title: '',
        body: '',
        roleId: 1,
        access: 'public',
      };
      request({
        url: endPoint,
        method: 'POST',
        json: userInfo,
      }, (err, res, body) => {
        expect(body).toBe('Empty title or body or access field!');
        done();
      });
    });
});
