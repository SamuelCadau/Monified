const config = require("./env");

module.exports = {
  clientID: config.oauth.microsoft.clientId,
  clientSecret: config.oauth.microsoft.clientSecret,
  callbackURL: config.oauth.microsoft.callbackURL,
  tenantID: config.oauth.microsoft.tenantId,
  scope: ["user.read"],
};
