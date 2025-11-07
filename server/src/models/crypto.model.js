module.exports = (sequelize, Sequelize) => {
    const Crypto = sequelize.define(
      "Crypto",
      {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
        symbol: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        volume: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        variation: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        historic: {
          type: Sequelize.JSON,
          allowNull: true,
        },
      },
      {
        tableName: "cryptos",
        timestamps: false,
      }
    );
    return Crypto;
  };
