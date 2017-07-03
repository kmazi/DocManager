import { generalValidation, validateEmail, validatePassword } from
'../../server/controller/middlewares/validation';

describe('Validating user input:', () => {
  it('Error message should be shown when script char (<,>) is used', () => {
    const user = generalValidation('<script>alert(\'I Love you\')</script>');
    expect(user.isValid).toBe(false);
    expect(user.err.includes('no html or script tab allowed')).toBe(true);
  });

  it('User field should not be empty', () => {
    const user = generalValidation('prince');
    expect(user.err.length).toBe(0);
    expect(user.isValid).toBe(true);
  });

  it('User show see error when they submit empty form', () => {
    const user = generalValidation('');
    expect(user.err.length).not.toBe(0);
    expect(user.isValid).toBe(false);
  });

  describe('Validating emails:', () => {
    it('Should accept correct emails', () => {
      const email = validateEmail('kingsleyu13@gmail.com');
      expect(email.isValid).toBe(true);
    });

    it('Should reject incorrect emails', () => {
      const email = validateEmail('kingsleyu13gmail.com');
      expect(email.isValid).toBe(false);
    });

    it('Should return an error message when email validation fails', () => {
      const email = validateEmail('yuuuuuu.com');
      expect(email.err.includes('Email has got a wrong format')).toBe(true);
    });

    it('should throw error when empty', () => {
      const email = validateEmail('');
      expect(email.isValid).toBe(false);
    });
  });

  describe('Passwords:', () => {
    it('should be at least 6 characters', () => {
      const password = validatePassword('testi');
      expect(password.isValid).toBe(false);
      expect(password.err.includes(
        'Password length must be between 6 and 20')).toBe(true);
    });

    it('should be at most 20 characters', () => {
      const password = validatePassword('testikhdhfh68dskksdhflfs9878s9ss');
      expect(password.isValid).toBe(false);
      expect(password.err.includes(
        'Password length must be between 6 and 20')).toBe(true);
    });

    it('should be between 6 and 20 both inclusive characters', () => {
      const password = validatePassword('merrymaking');
      expect(password.isValid).toBe(true);
      expect(password.err.includes(
        'Password length must be between 6 and 20')).toBe(false);
    });
  });
});

