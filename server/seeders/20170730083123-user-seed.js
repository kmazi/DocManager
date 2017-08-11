
module.exports = {
  up(queryInterface) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Users', [{
      username: 'SuperAdmin',
      password: process.env.ADMINPASSWORD,
      roleId: 1,
      email: 'superadmin@gmail.com',
      isactive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      username: 'touchstone',
      password: process.env.ADMINPASSWORD,
      roleId: 2,
      email: 'touchstone@gmail.com',
      isactive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down() {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
