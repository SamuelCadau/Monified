const passport = require("passport");
const config = require("../../config/google.config");
const authConfig = require("../../config/auth.config");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userService = require("../../services/User/user.services");
const UserService = new userService();
const authService = require("../../services/Auth/auth.services");
const AuthService = new authService();
const jwt = require("jsonwebtoken");
const createLogger = require("../../utils/logger");

const logger = createLogger("passport:google");
const isConfigured =
  Boolean(config.clientID) && Boolean(config.clientSecret) && Boolean(config.callbackURL);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

if (!isConfigured) {
  logger.warn(
    "Google OAuth strategy disabled (missing GOOGLE_CLIENT_ID/SECRET/CALLBACK)."
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: config.scope,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const userFound = await UserService.findByEmail(email).then(
            async (user) => {
              if (user) {
                return jwt.sign(
                  { id: user.id },
                  authConfig.secret,
                  {
                    algorithm: "HS256",
                    expiresIn: authConfig.expiresIn,
                  }
                );
              }
              const newUser = await AuthService.register({
                email: email,
                username:
                  profile.name.givenName +
                  "." +
                  profile.name.familyName +
                  "." +
                  profile.id,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                password: config.password,
                role_id: 1,
              });
              return jwt.sign(
                { id: newUser.id },
                authConfig.secret,
                {
                  algorithm: "HS256",
                  expiresIn: authConfig.expiresIn,
                }
              );
            }
          );
          return done(null, userFound);
        } catch (error) {
          logger.error("Google OAuth failed", error);
          return done(error);
        }
      }
    )
  );
}
