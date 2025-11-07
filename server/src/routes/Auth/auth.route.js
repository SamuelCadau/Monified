module.exports = (app) => {
  const Controller = require("../../controllers/Auth/auth.controller.js");
  const Auth = new Controller();
  const passport = require("passport");
  const router = require("express").Router();
  const { successResponse, errorResponse } = require("../../helpers/index");
  const config = require("../../config/env");

  const googleSuccessRedirect = config.mail.frontendBaseUrl.replace(/\/$/, "") + "/";
  const hasValue = (value) =>
    typeof value === "string" && value.trim().length > 0;
  const isGoogleOAuthEnabled =
    hasValue(config.oauth.google.clientId) &&
    hasValue(config.oauth.google.clientSecret);
  const isMicrosoftOAuthEnabled =
    hasValue(config.oauth.microsoft.clientId) &&
    hasValue(config.oauth.microsoft.clientSecret);

  const registerOAuthDisabledRoutes = (provider) => {
    const disabledHandler = (req, res) =>
      errorResponse(
        req,
        res,
        `OAuth ${provider} indisponible (TODO: configurer les identifiants).`,
        501
      );
    router.get(`/${provider}`, disabledHandler);
    router.get(`/${provider}/callback`, disabledHandler);
    router.get(`/${provider}/success`, disabledHandler);
    router.get(`/${provider}/failure`, disabledHandler);
    router.get(`/${provider}/logout`, disabledHandler);
  };

  // Register new user
  router.post("/register", Auth.register);

  // Login user
  router.post("/login", Auth.login);

  /** MICROSOFT OAUTH 2.0 */

  if (isMicrosoftOAuthEnabled) {
    // Login user with Microsoft
    router.get(
      "/microsoft",
      passport.authenticate("microsoft", {
        scope: ["openid"],
      })
    );

    // Callback route for Microsoft to redirect to
    router.get(
      "/microsoft/callback",
      passport.authenticate("microsoft", {
        failureRedirect: "/api/auth/microsoft/failure",
        successRedirect: "/api/auth/microsoft/success",
      })
    );

    // Callback success Microsoft
    router.get("/microsoft/success", (req, res) => {
      if (!req.user) {
        res.redirect("/microsoft/failure");
      }
      successResponse(req, res, req.user, "Login success");
    });

    // Callback failure Microsoft
    router.get("/microsoft/failure", (req, res) => {
      errorResponse(req, res, "Login failed", 401);
    });

    // Logout user Microsoft
    router.get("/microsoft/logout", function (req, res, next) {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  } else {
    registerOAuthDisabledRoutes("microsoft");
  }

  /** GOOGLE OAUTH 2.0 */

  if (isGoogleOAuthEnabled) {
    // Login user with Google
    router.get(
      "/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      })
    );

    // Callback route for Google to redirect to
    router.get(
      "/google/callback",
      passport.authenticate("google", {
        failureRedirect: "/api/auth/google/failure",
        successRedirect: googleSuccessRedirect,
      })
    );

    // Callback success Google
    router.get("/google/success", (req, res) => {
      if (!req.user) {
        res.redirect("/google/failure");
      }
      successResponse(req, res, req.user, "Login success");
    });

    // Callback failure Google
    router.get("/google/failure", (req, res) => {
      errorResponse(req, res, "Login failed", 401);
    });

    // Logout user with Google
    router.get("/google/logout", function (req, res, next) {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  } else {
    registerOAuthDisabledRoutes("google");
  }

  // ask for password reset
  router.post("/request-password-reset", Auth.requestPasswordReset);

  app.use("/api/auth", router);
};
