import bcrypt from 'bcrypt';
import index from '../models';
import {
  createToken,
  validateEmail,
  validatePassword
} from '../controller/middlewares/validation';

const user = index.User;
const role = index.Roles;
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
        isactive: userInfo.isactive,
      }
    }).spread((createdUser, isCreated) => {
      // send successful as response when the user is created
      if (isCreated) {
        role.findById(createdUser.roleId).then((userRole) => {
          if (userRole) {
            const userDetail = {
              userName: createdUser.username,
              userId: createdUser.id,
              email: createdUser.email,
              isactive: createdUser.isactive,
              roleType: userRole.roletype,
              createdAt: createdUser.createdAt,
            };
            const token = createToken(userDetail);
            res.status(200).send({
              status: 'successful',
              ...userDetail,
              token,
            });
          }
        }).catch();
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'User already exist',
        });
      }
    }).catch(() => {
      res.status(500).send({
        status: 'unsuccessful',
        message:
        'Server error just occured!'
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
  let errorMessage = '';
  const UserException = (message) => {
    errorMessage = message;
    this.name = 'UserException';
  };
  const userInfo = req.body;
  user.find({
    where: {
      username: userInfo.userName,
    }
  }).then((existingUser) => {
    const userPassword = existingUser.password;
    if (!existingUser.isactive) {
      throw new UserException('user is inactive');
    }
    bcrypt.compare(userInfo.password, userPassword, (err, isValid) => {
      // check if the password is correct then create a token
      if (isValid) {
        role.findById(existingUser.roleId).then((userRole) => {
          if (userRole) {
            const userDetail = {
              userName: existingUser.username,
              userId: existingUser.id,
              email: existingUser.email,
              isactive: existingUser.isactive,
              roleType: userRole.roletype,
              createdAt: existingUser.createdAt,
            };
            const token = createToken(userDetail);
            res.status(200).send({
              status: 'successful',
              ...userDetail,
              token,
            });
          }
        }).catch();
      } else {
        res.status(400).send({
          status: 'unsuccessful',
          message: ['Wrong password!'],
        });
      }
    });
  }).catch(() => {
    res.status(400).send({
      status: 'unsuccessful',
      message: errorMessage !== '' ? errorMessage : ['Wrong username!'],
    });
  });
};

/**
 * View specific user profile
* @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const viewUserProfile = (req, res) => {
  const id = Number(req.params.userId);
  user.findById(id).then((userDetail) => {
    if (userDetail && req.body.user.userId === id
      && userDetail.isactive) {
      res.status(200).send({
        status: 'successful',
        userName: userDetail.username,
        userEmail: userDetail.email,
        userRole: req.body.user.roleType,
      });
    } else {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'You cannot view another user\'s detail',
      });
    }
  }).catch(() => {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Error due to invalid user!',
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
    attributes: ['id', 'username', 'email', 'roleId', 'isactive', 'createdAt'],
    ...params
  }).then((users) => {
    res.status(200).send({
      status: 'successful',
      count: users.count,
      users: users.rows,
    });
  }).catch(() => {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Could not fetch all users!',
    });
  });
};

/**
 * Finds users by username
 * @param {object} req - The request object from express server
 * @param {object} res - The response object from express server
 * @return {null} Returns null
 */
const findUsers = (req, res) => {
  const searchParams = req.query;
  let params;
  // check it limit and offset where passed
  if (searchParams.offset && searchParams.limit) {
    params = { offset: searchParams.offset, limit: searchParams.limit };
  }
  if (!req.query.q) {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'No username to search for!'
    });
  } else {
    user.findAndCountAll({
      where: {
        username: {
          $iLike: `%${req.query.q}%`
        }
      },
      attributes:
      ['id', 'username', 'email', 'roleId', 'isactive', 'createdAt'],
      ...params,
    }).then((users) => {
      res.status(200).send({
        status: 'successful',
        count: users.count,
        users: users.row,
      });
    }).catch(() => {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Unable to get user(s)',
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
  const userId = Number(req.params.id);
  const saltRound = 10;
  const userDetail = {};
  // Only the superadmin can edit the role of a user
  if (req.body.roleId && req.body.roleId > 0 && req.body.roleId < 5
    && req.body.user.roleType === 'Admin'
    && req.body.user.userName === 'SuperAdmin') {
    userDetail.roleId = req.body.roleId;
  }
  if (req.body.email &&
    validateEmail(req.body.email, 'email').status === 'successful') {
    userDetail.email = req.body.email;
  }
  if (typeof req.body.isactive !== 'undefined' &&
    req.body.user.roleType === 'Admin') {
    userDetail.isactive = req.body.isactive;
  }
  bcrypt.hash(req.body.password, saltRound, (err, hash) => {
    if (req.body.password &&
      validatePassword(req.body.password, 'password').status === 'successful') {
      userDetail.password = hash;
    }
    if (userId === req.body.user.userId
      || req.body.user.userName === 'SuperAdmin'
      || req.body.user.roleType === 'Admin') {
      user.update(userDetail, {
        where: {
          id: userId,
        }
      }).then(() => {
        if (Object.keys(userDetail).length !== 0) {
          res.status(200).send({
            status: 'successful',
          });
        } else {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'update failed!',
          });
        }
      }).catch(() => {
        res.status(400).send({
          status: 'unsuccessful',
          message: 'Could not find any user to update!',
        });
      });
    } else {
      res.status(400).send({
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
  user.findById(userId).then((knownUser) => {
    if (!knownUser) {
      res.status(400).send({
        status: 'unsuccessful',
        message: 'Could not find any user!',
      });
    } else {
      user.update({ isactive: false }, {
        where: {
          id: userId,
        }
      }).then(() => {
        res.status(200).send({
          status: 'successful',
          message: `${knownUser.username} has been successfull deactivated!`,
        });
      }).catch();
    }
  }).catch(() => {
    res.status(500).send({
      status: 'unsuccessful',
      message: 'Invalid user ID!',
    });
  });
};
export {
  signUpUser,
  signInUser,
  getAllUsers,
  updateUser,
  deleteUser,
  findUsers,
  viewUserProfile
};
