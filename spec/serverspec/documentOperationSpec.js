import request from 'request';

describe('Creating documents:', () => {
  it('should set status code to 422 at when empty form is sent',
  (done) => {
    const endPoint = 'http://localhost:1844/document';
    request.post(endPoint, (error, response) => {
      expect(response.statusCode).toBe(422);
      done();
    });
  });

  it('should return true when document is successfully created',
  (done) => {
    const endPoint = 'http://localhost:1844/document';
    request.get(endPoint, (error, response, body) => {
      expect(body).toBe(true);
      done();
    });
  });
});
