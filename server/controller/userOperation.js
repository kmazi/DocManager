import bcrypt from 'bcrypt';
import queryString from 'querystring';
import index from '../models';
import { createToken } from '../controller/middlewares/validation';

/**
 * Signs up new users to access the application
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @return {null} Returns void
 */
const signUpUser = (req, res) => {
  const user = index.User;
  const userInfo = req.body;
  const saltRound = 10;
  bcrypt.hash(userInfo.password, saltRound, (err, hash) => {
    userInfo.password = hash;
    // find or create the user if they don't already exist in the
  // database
    user.findOrCreate({
      where: {
        username: userInfo.userName
      },
      defaults: {
        username: userInfo.userName,
        email: userInfo.email,
        password: userInfo.password,
        roleId: userInfo.roleId,
      }
    }).spread((createdUser, isCreated) => {
      // send successful as response when the user is created
      if (isCreated) {
        const token = createToken(userInfo);
        const query = queryString.stringify({
          status: 'successful',
          userName: createdUser.username,
          token
        });
        res.redirect(`/users/${createdUser.id}/documents?${query}`);
      } else {
        res.send({
          status: 'unsuccessful',
          message: 'User already exist',
        });
      }
    }).catch(() => {
      res.send({
        status: 'unsuccessful',
        message:
        'An error just occured on the server while trying to sign you up'
      });
    });
  });
};

const signInUser = (req, res) => {
  const user = index.User;
  const userInfo = req.query;
  user.find({
    where: {
      username: userInfo.userName,
    }
  }).then((existingUser) => {
    const userPassword = existingUser.password;
    bcrypt.compare(userInfo.password, userPassword, (err, isValid) => {
      // check if the password is correct then create a token
      if (isValid) {
        const userDetail = {
          userName: existingUser.username,
          roleId: existingUser.roleId,
          userEmail: existingUser.email,
        };
        const token = createToken(userDetail);
        const query = queryString.stringify({
          userName: existingUser.username,
          token
        });
        res.redirect(`/users/${existingUser.id}/documents?${query}`);
      } else {
        res.send({
          status: 'unsuccessful',
          message: 'Wrong username or password',
        });
      }
    });
  }).catch(() => {
    res.send({
      status: 'unsuccessful',
      message: 'Wrong username',
    });
  });
};

export { signUpUser, signInUser };
