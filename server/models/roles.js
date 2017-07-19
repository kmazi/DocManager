/**
 * Creates the document model
 * @param {object} sequelize - the sequelize object to use in defining the model
 * @param {object} DataTypes - represents the datatypes to be used on the model
 * @return {object} returns the roles created
 */
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    roletype: DataTypes.STRING,
    unique: true
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        // Many users can be in the same role
        Roles.hasMany(models.User, {
          foreignKey: 'roleId',
          as: 'users'
        });
      }
    }
  });
  return Roles;
};
