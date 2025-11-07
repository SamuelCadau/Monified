const env = require("./env");

const base = {
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect,
  logging: env.db.logging,
};

const sqliteExtras =
  env.db.dialect === "sqlite"
    ? { storage: env.db.storage, host: undefined, port: undefined }
    : {};

module.exports = {
  development: {
    ...base,
    ...sqliteExtras,
  },
  test: {
    ...base,
    dialect: "sqlite",
    storage: env.db.storage,
    host: undefined,
    port: undefined,
    logging: false,
  },
  production: {
    ...base,
    ...sqliteExtras,
  },
};
