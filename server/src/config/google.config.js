const config = require("./env");

module.exports = {
  clientID: config.oauth.google.clientId,
  clientSecret: config.oauth.google.clientSecret,
  callbackURL: config.oauth.google.callbackURL,
  scope: ["profile"],
  password: config.security.tempPassword,
};
