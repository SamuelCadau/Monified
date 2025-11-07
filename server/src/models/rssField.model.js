module.exports = (sequelize, Sequelize) => {
  const RssField = sequelize.define(
    "RssField",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pubDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contentEncoded: {
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
    },
    {
      tableName: "rssFields",
      timestamps: false,
    }
  );
  return RssField;
};
