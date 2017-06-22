
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: { type: DataTypes.STRING,
      allowNull: false },
    body: { type: DataTypes.TEXT,
      allowNull: false },
    access: { type: DataTypes.STRING,
      allowNull: false }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      }
    }
  });
  return Document;
};
