import bcrypt from 'bcrypt';
import queryString from 'querystring';
import index from '../models';
import { createToken } from '../controller/middlewares/validation';

const user = index.User;
/**
 * Signs up new users to access the application
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @return {null} Returns void
 */
const signUpUser = (req, res) => {
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
/**
 * Authenticates a user
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const signInUser = (req, res) => {
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
        res.send({
          status: 'successful',
          userName: existingUser.username,
          token,
        });
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
      message: 'Could not identify you!',
    });
  });
};

/**
 * Fetches all users
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const getAllUsers = (req, res) => {
  const searchParams = req.query;
  let params;
  // check it limit and offset where passed
  if (searchParams.offset && searchParams.limit) {
    params = { offset: searchParams.offset, limit: searchParams.limit };
  }
  user.findAndCountAll({
    attributes: ['id', 'username', 'email', 'roleId', 'createdAt'],
    ...params
  }).then((users) => {
    res.send({
      status: 'successful',
      count: users.count,
      users: users.rows,
    });
  }).catch(() => {
    res.send({
      status: 'unsuccessful',
      message: 'Could not fetch all users!',
    });
  });
};

/**
 * Finds a specific user
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const findUser = (req, res) => {
  const userId = req.params.id;
  if (userId > 0 && Number.isInteger(Number(req.params.id))) {
    user.findById(userId).then((knownUser) => {
      if (knownUser === null) {
        res.send({
          status: 'unsuccessful',
          message: 'Could not fetch any user!',
        });
      } else {
        res.send({
          status: 'successful',
          userInfo: knownUser,
        });
      }
    }).catch(() => {
      res.send({
        status: 'unsuccessful',
        message: 'Could not fetch any user!',
      });
    });
  } else {
    res.send({
      status: 'unsuccessful',
      message: 'Invalid search parameter!',
    });
  }
};

/**
 * Finds users by username
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const findUsers = (req, res) => {
  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    res.send({
      status: 'unsuccessful',
      message: 'No user detail to search for!'
    });
  } else {
    user.findAndCountAll({
      where: { username: {
        $iLike: req.query.q
      } },
      attributes: ['id', 'username', 'email', 'roleId', 'createdAt'],
    }).then((users) => {
      res.send({
        status: 'successful',
        users
      });
    }).catch((err) => {
      res.send({
        status: 'unsuccessful',
        message: 'Unable to get user(s)',
        err
      });
    });
  }
};

/**
 * Updates a specific user
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const updateUser = (req, res) => {
  const userId = req.params.id;
  const saltRound = 10;
  bcrypt.hash(req.body.password, saltRound, (err, hash) => {
    if (userId > 0 && Number.isInteger(Number(req.params.id))) {
      user.update({
        usename: req.body.userName,
        roleId: req.body.roleId,
        email: req.body.email,
        password: hash,
      }, {
        where: {
          id: userId,
        }
      }).then((result) => {
        if (result > 0) {
          res.send({
            status: 'successful',
          });
        } else {
          res.send({
            status: 'unsuccessful',
          });
        }
      }).catch((err) => {
        res.send({
          status: 'unsuccessful',
          message: 'Could not find any user to update!',
          err
        });
      });
    } else {
      res.send({
        status: 'unsuccessful',
        message: 'No user found!',
      });
    }
  });
};

/**
 * Delete a specific user
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const deleteUser = (req, res) => {
  const userId = req.params.id;
  if (userId > 0 && Number.isInteger(Number(req.params.id))) {
    user.findById(userId).then((knownUser) => {
      if (knownUser === null) {
        res.send({
          status: 'unsuccessful',
          message: 'Could not find any user!',
        });
      } else {
        knownUser.destroy().then(() => {
          res.send({
            status: 'successful',
            message: `${knownUser.username} has been deleted!`,
          });
        }).catch(() => {
          res.send({
            status: 'unsuccessful',
            message: 'Could not delete the user!',
          });
        });
      }
    }).catch();
  } else {
    res.send({
      status: 'unsuccessful',
      message: 'No user found!',
    });
  }
};
export { signUpUser,
  signInUser,
  getAllUsers,
  findUser,
  updateUser,
  deleteUser,
  findUsers };
