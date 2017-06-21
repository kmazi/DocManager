import request from 'request';

describe('The app route', () => {
  it('should return a status code of 200 when the default root is called',
  (done) => {
    const endPoint = 'http://localhost:1844/';
    request.get(endPoint, (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should fire the error route callback when no route is matched',
  (done) => {
    const endPoint = 'http://localhost:1844/getball';
    request.get(endPoint, (error, response, body) => {
      expect(body).toBe(`404 error has occured! The page you're 
      searching for cannot be found`);
      expect(response.statusCode).toBe(404);
      done();
    });
  });
});
