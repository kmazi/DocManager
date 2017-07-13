import dotenv from 'dotenv';
import { createToken, verifyToken } from
'../../server/controller/middlewares/validation';

dotenv.config();
describe('', () => {
  let user = {};
  beforeAll(() => {
    user = {
      username: 'Prince',
      email: 'prince@yahoo.com',
      password: 'cometome',
    };
  });
  describe('when creating Json webtoken:', () => {
    it('createToken function should successfully create the token', () => {
      const token = createToken(user, process.env.SUPERSECRET);
      expect(token).not.toBeNull();
    });
  });

  describe('when verifying Json webtoken:', () => {
    it(`verifyToken()should return the user object whose isValid
   property is set to false when an invalid token is submitted`, () => {
      const token =
  'ueie79kkshdfjsd08fs9dsf.sdfdsfklsdf933ksdflsdlsdsdf.30293729377mskfsjkf';
      const req = { body: {
        token: `ueie79kkshdfjsd08fs9dsf.
        sdfdsfklsdf933ksdflsdlsdsdf.30293729377mskfsjkf` }
      };
      const newUser = verifyToken(req, res);
      expect(newUser.valid).toBe(false);
    });
  });
});

