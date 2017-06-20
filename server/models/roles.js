
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    userId: DataTypes.INTEGER,
    roletype: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      }
    }
  });
  return Roles;
};
