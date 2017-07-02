import index from '../models';

/**
 * Signs up new users to access the application
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @return {null} Returns void
 */
const signUpUser = (req, res) => {
  const user = index.User;
  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  const roleId = req.body.roleId;
  user.findOrCreate({
    where: {
      email,
      username: userName
    },
    defaults: {
      username: userName,
      email,
      password,
      roleId,
    }
  }).spread((createdUser, isCreated) => {
    if (isCreated) {
      res.send({
        status: 'successful',
        userId: createdUser.id
      });
    }
  }).catch((err) => {
    res.send({
      status: 'unsuccessful',
      err
    });
  });
};

export { signUpUser };
