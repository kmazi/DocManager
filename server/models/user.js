/**
 * Creates the document model
 * @param {object} sequelize - the sequelize object to use in defining the model
 * @param {object} DataTypes - represents the datatypes to be used on the model
 * @return {object} returns the document created
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: { type: DataTypes.STRING,
      allowNull: false },
    password: { type: DataTypes.STRING,
      allowNull: false },
    roleId: { type: DataTypes.INTEGER,
      allowNull: false }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        // a user can have multiple documents
        User.hasMany(models.Document, {
          foreignKey: 'userId',
          as: 'documents'
        });
        // a user can only belong to a certain role
        User.belongsTo(models.Roles, {
          foreignKey: 'roleId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return User;
};
