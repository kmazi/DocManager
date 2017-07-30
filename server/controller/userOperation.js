import bcrypt from 'bcrypt';
import index from '../models';
import { createToken, validateEmail, validatePassword } from '../controller/middlewares/validation';

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
  const userInfo = req.body;
  user.find({
    where: {
      username: userInfo.userName,
    }
  }).then((existingUser) => {
    const userPassword = existingUser.password;
    bcrypt.compare(userInfo.password, userPassword, (err, isValid) => {
      // check if the password is correct then create a token
      if (isValid) {
        role.findById(existingUser.roleId).then((userRole) => {
          if (userRole) {
            const userDetail = {
              userName: existingUser.username,
              userId: existingUser.id,
              email: existingUser.email,
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
      message: ['Wrong username!'],
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
  if (Number.isInteger(id) && id > 0) {
    user.findById(id).then((userDetail) => {
      if (userDetail && req.body.user.userId === id) {
        role.findOne({
          where: {
            id: req.body.user.roleId,
          }
        }).then((roleType) => {
          if (roleType) {
            res.status(200).send({
              status: 'successful',
              userName: userDetail.username,
              userEmail: userDetail.email,
              userRole: roleType.roletype,
            });
          } else {
            res.status(400).send({
              status: 'unsuccessful',
              message: 'You belong to an inactive role!',
            });
          }
        }).catch(() => {
          res.status(400).send({
            status: 'unsuccessful',
            message: 'Could not find your role!',
          });
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
  } else {
    res.status(400).send({
      status: 'unsuccessful',
      message: 'Invalid user ID',
    });
  }
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
  const userId = Number(req.params.id);
  if (Number.isInteger(userId) && userId > 0) {
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
  if (!req.query.q) {
    res.send({
      status: 'unsuccessful',
      message: 'No user detail to search for!'
    });
  } else {
    user.findAndCountAll({
      where: {
        username: {
          $iLike: `%${req.query.q}%`
        }
      },
      attributes: ['id', 'username', 'email', 'roleId', 'createdAt'],
    }).then((users) => {
      res.send({
        status: 'successful',
        users
      });
    }).catch(() => {
      res.send({
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
  if (req.body.userName) {
    userDetail.usename = req.body.userName;
  }
  if (req.body.roleId && req.body.roleId > 0 && req.body.roleId < 5) {
    userDetail.roleId = req.body.roleId;
  }
  if (req.body.email &&
    validateEmail(req.body.email, 'email').status === 'successful') {
    userDetail.email = req.body.email;
  }
  bcrypt.hash(req.body.password, saltRound, (err, hash) => {
    if (req.body.password &&
      validatePassword(req.body.password, 'password').status === 'successful') {
      userDetail.password = hash;
    }
    if (Number.isInteger(userId) && userId > 0 &&
      userId === req.body.user.userId) {
      user.update(userDetail, {
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
      }).catch(() => {
        res.send({
          status: 'unsuccessful',
          message: 'Could not find any user to update!',
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
  findUsers,
  viewUserProfile };
