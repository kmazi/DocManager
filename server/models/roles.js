'use strict';
module.exports = function(sequelize, DataTypes) {
  var Roles = sequelize.define('Roles', {
    userId: DataTypes.INTEGER,
    roletype: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Roles;
};