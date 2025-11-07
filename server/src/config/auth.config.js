const config = require("./env");

module.exports = {
  secret: config.security.jwtSecret,
  expiresIn: config.security.jwtExpiresIn,
};
