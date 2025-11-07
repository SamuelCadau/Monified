const passport = require("passport");
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const config = require("../../config/microsoft.config");
const createLogger = require("../../utils/logger");

const logger = createLogger("passport:microsoft");
const isConfigured =
  Boolean(config.clientID) &&
  Boolean(config.clientSecret) &&
  Boolean(config.callbackURL) &&
  Boolean(config.tenantID);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

if (!isConfigured) {
  logger.warn(
    "Microsoft OAuth strategy disabled (missing MS_CLIENT_ID/SECRET/CALLBACK_URL/TENANT)."
  );
} else {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        tenantID: config.tenantID,
        scope: config.scope,
        tokenURL:
          "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        authorizationURL:
          "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      },
      (accessToken, refreshToken, params, profile, done) => {
        return done(null, profile);
      }
    )
  );
}
