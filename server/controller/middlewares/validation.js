import JwtToken from 'jsonwebtoken';
import index from '../../models';

const userModel = index.User;
/**
 * Creates a web token for the user
 * @param {object} user - The user object to create token for
 * @return {string} returns the jsonwebtoken created
 */
const createToken = user => JwtToken.sign(user,
  process.env.SUPERSECRET);

/**
 * Verifies that the submitted token is authentic before granting access
 * to other functionalities
 * @param {object} req - The token to verify
 * @param {object} res - The token to verify
 * @return {null} Returns void
 */
const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token;
  JwtToken.verify(token, process.env.SUPERSECRET, (err, verifiedToken) => {
    if (err) {
      res.send({
        status: 'unsucessful',
        message: 'You are not authenticated!',
      });
    } else {
      userModel.findOne({
        where: { username: verifiedToken.userName }
      }).then(() => {
        next();
      }).catch(() => {
        res.redirect('/');
      });
    }
  });
};
/**
 * Middleware functionality to check for null or empty form fields
 * @param {string} formfield - the input to validate
 * @return {object} returns an object that contain validation status an
 * error messages if any
 */
const generalValidation = (formfield) => {
  const user = { status: 'successful', message: [] };
  if (typeof formfield === 'undefined') {
    user.status = 'unsuccessful';
    user.message.push('Undefined fields are not allowed');
    return user;
  }
  // check for null and empty fields
  if (formfield === null || formfield === '') {
    user.status = 'unsuccessful';
    user.message.push('Empty fields are not allowed');
  }
  // check to see if script characters are included
  if (formfield.includes('<') || formfield.includes('>')) {
    user.status = 'unsuccessful';
    user.message.push('Invalid input character(s)');
  }
  return user;
};


/**
 * Validate the user email input
 * @param {string} inputEmail - The input email to validate
 * @return {object} returns an object that contain validation status an
 * error messages if any
 */
const validateEmail = (inputEmail) => {
  const email = generalValidation(inputEmail);
  // check to see if email entered follows the standard format
  if (email.status === 'successful') {
    const foundMatch = inputEmail.match(
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g);
    if (!foundMatch) {
      email.status = 'unsuccessful';
      email.message.push('Email has got a wrong format');
    }
  }
  return email;
};

/**
 * Validate the user password input
 * @param {string} inputPassword - The input password to validate
 * @return {object} returns an object that contain validation status an
 * error messages if any
 */
const validatePassword = (inputPassword) => {
  // check if the password is empty or null
  const password = generalValidation(inputPassword);
  if (password.status === 'successful') {
    if (inputPassword.length < 6 || inputPassword.length > 20) {
      password.status = 'unsuccessful';
      password.message.push('Password length must be between 6 and 20');
    }
  }
  return password;
};
/**
 * Middleware functionality to validate user input during signin
 * @param {object} req - The request object from express
 * @param {object} res - The response object from express
 * @param {object} next - The function to move control to next middleware
 * @return {object} returns void
 */
const signInValidation = (req, res, next) => {
  // get the user detail from the request body
  const userInfo =
    (Object.keys(req.body).length === 0 && req.body.constructor === Object)
      ? req.query : req.body;
  const err = { status: 'successful', message: [] };
  const userNameValidation = generalValidation(userInfo.userName);
  const passwordValidation = validatePassword(userInfo.password);
  if (userNameValidation.status !== 'successful') {
    err.status = 'unsuccessful';
    err.message = userNameValidation.message;
    res.send(err);
  } else
    // set error message when password is invalid
    if (passwordValidation.status !== 'successful') {
      err.status = 'unsuccessful';
      err.message = passwordValidation.message;
      res.send(err);
    } else {
      next();
    }
};

/**
 * Middleware functionality to validate user input during signup
 * @param {object} req - The request object from express
 * @param {object} res - The response object from express
 * @param {object} next - The function to move control to next middleware
 * @return {object} returns void
 */
const signUpValidation = (req, res, next) => {
  // get the user detail from the request body and check if they are valid
  const userInfo =
  (Object.keys(req.query).length === 0 && req.query.constructor === Object)
  ? req.body : req.query;
  const err = { status: 'successful', message: [] };
  const userNameValidation = generalValidation(userInfo.userName);
  const passwordValidation = validatePassword(userInfo.password);
  const emailValidation = validateEmail(userInfo.email);
  // set error message when username isn't valid
  if (userNameValidation.status !== 'successful') {
    err.status = 'unsuccessful';
    err.message = userNameValidation.message;
    res.send(err);
  } else
    // set error message when password is invalid
    if (passwordValidation.status !== 'successful') {
      err.status = 'unsuccessful';
      err.message = passwordValidation.message;
      res.send(err);
    } else
      // validating user email
      if (emailValidation.status !== 'successful') {
        err.status = 'unsuccessful';
        err.message = emailValidation.message;
        res.send(err);
      } else {
        // send execution to the next middleware if no error exist
        next();
      }
};

export {
  signUpValidation, signInValidation, generalValidation, validateEmail,
  validatePassword, createToken, verifyToken
};
