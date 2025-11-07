const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const envConfig = require("../config/env");
const createLogger = require("../utils/logger");

const basename = path.basename(__filename);
const db = {};
const logger = createLogger("sequelize");
const config = require("../config/database.config")[envConfig.env] || {};

const logging = config.logging
  ? (msg) => logger.debug(msg)
  : false;

const sequelizeOptions = {
  host: config.host,
  port: config.port,
  dialect: config.dialect || envConfig.db.dialect,
  storage: config.storage || envConfig.db.storage,
  logging,
  pool: {
    min: envConfig.db.poolMin,
    max: envConfig.db.poolMax,
  },
};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], sequelizeOptions);
} else if (sequelizeOptions.dialect === "sqlite") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: sequelizeOptions.storage,
    logging: sequelizeOptions.logging,
  });
} else {
  sequelize = new Sequelize(
    config.database || envConfig.db.name,
    config.username || envConfig.db.user,
    config.password || envConfig.db.password,
    sequelizeOptions
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//= ==============================
// Define all Models below
//= ==============================

db.User = require("./user.model")(sequelize, Sequelize);
db.Role = require("./role.model")(sequelize, Sequelize);
db.RssField = require("./rssField.model")(sequelize, Sequelize);
db.Crypto = require("./crypto.model")(sequelize, Sequelize);
db.Bookmark = require("./bookmark.model")(sequelize, Sequelize);
db.Picture = require("./picture.model")(sequelize, Sequelize);

//= ==============================
// Define all Relationships below
//= ==============================

// User has one Role
db.User.belongsTo(db.Role, {
  foreignKey: "role_id",
  as: "role",
});

// Role has many Users
db.Role.hasMany(db.User, {
  foreignKey: "role_id",
  as: "users",
});

// User has many Crypto
db.User.belongsToMany(db.Crypto, {
  through: "Bookmark",
  as: "cryptos",
  foreignKey: "user_id",
});

// Crypto has many User
db.Crypto.belongsToMany(db.User, {
  through: "Bookmark",
  as: "users",
  foreignKey: "crypto_id",
});

// User has one Picture
db.User.hasOne(db.Picture, {
  foreignKey: "user_id",
  as: "picture",
});
db.Picture.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

// Crypto has one Picture
db.Crypto.hasOne(db.Picture, {
  foreignKey: "crypto_id",
  as: 'picture'
});
db.Picture.belongsTo(db.Crypto, {
  foreignKey: "crypto_id",
  as: 'crypto'
});

module.exports = db;
