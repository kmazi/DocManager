
/**
 * Middleware functionality to check for null or empty form fields
 * @param {string} formfield - the input to validate
 * @return {object} returns an object contains isvalid property and error
 */
const generalValidation = (formfield) => {
  const user = { isValid: true, err: [] };
  // check for null and empty fields
  if (formfield === null || formfield === '') {
    user.isValid = false;
    user.err.push('Empty fields are not allowed');
  }
  // check to see if script characters are included
  if (formfield.includes('<') || formfield.includes('>')) {
    user.isValid = false;
    user.err.push('no html or script tab allowed');
  }
  return user;
};

/**
 * Validate the user email input
 * @param {string} inputEmail - The input email to validate
 * @return {object} returns an object that contain isValid prop and err prop
 */
const validateEmail = (inputEmail) => {
  const email = generalValidation(inputEmail);
  // check to see if email entered follows the standard format
  if (email.isValid) {
    const foundMatch = inputEmail.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g);
    if (!foundMatch) {
      email.isValid = false;
      email.err.push('Email has got a wrong format');
    }
  }
  return email;
};

/**
 * Validate the user password input
 * @param {string} inputPassword - The input password to validate
 * @return {object} returns an object that contains info
 * (isValid and err properties) about the validation
 */
const validatePassword = (inputPassword) => {
  const password = generalValidation(inputPassword);
  if (password.isValid) {
    if (inputPassword.length < 6 || inputPassword.length > 20) {
      password.isValid = false;
      password.err.push('Password length must be between 6 and 20');
    }
  }
  return password;
};

/**
 * Middleware functionality to validate user input
 * @param {object} req - The request object from express
 * @param {object} res - The response object from express
 * @param {object} next - The function to move control to next middleware
 * @return {object} returns void
 */
const userValidation = (req, res, next) => {
  const username = req.body.userName;
  const password = req.body.password;
  const email = req.body.email;
  const err = {};
  const userNameValidation = generalValidation(username);
  const passwordValidation = validatePassword(password);
  const emailValidation = validateEmail(email);
  // set error message when username isn't valid
  if (!userNameValidation.isValid) {
    err.username = userNameValidation.err;
  }
  // set error message when password is invalid
  if (!passwordValidation.isValid) {
    err.password = passwordValidation.err;
  }
  // validating user email
  if (!emailValidation.isValid) {
    err.email = emailValidation.err;
  }
  // send execution to the next middleware if no error exist otherwise
  // end request with the error messages
  if (Object.keys(err).length === 0 && err.constructor === Object) {
    next();
  } else {
    res.send(err);
  }
};

export {
  userValidation, generalValidation, validateEmail,
  validatePassword
};
