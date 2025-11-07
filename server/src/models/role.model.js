module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "roles",
      timestamps: false,
    }
  );
  return Role;
};
