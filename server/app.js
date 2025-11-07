const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

const config = require("./src/config/env");
const db = require("./src/models");
const createLogger = require("./src/utils/logger");

const logger = createLogger("app");
const app = express();

require("./src/passport/Google/index.passport");
require("./src/passport/Microsoft/index.passport");

app.disable("x-powered-by");

// SESSION MANAGER
app.use(
  session({
    secret: config.security.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.server.corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// AUTHORISATION FOR PICTURE
app.use(express.static(path.join(__dirname, "public")));
global.__basedir = __dirname;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", config.server.corsOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API Monified." });
});

app.get("/healthz", async (req, res) => {
  const basePayload = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  try {
    await db.sequelize.authenticate();
    res.json({
      status: "ok",
      ...basePayload,
      dependencies: {
        database: "up",
      },
    });
  } catch (error) {
    logger.warn("Health check database probe failed", { error: error.message });
    res.status(503).json({
      status: "error",
      message: "Database connectivity failed",
      ...basePayload,
      dependencies: {
        database: error.message,
      },
    });
  }
});

// DECLARE ROUTES
require("./src/routes/User/user.route")(app);
require("./src/routes/Auth/auth.route")(app);
require("./src/routes/Role/role.route")(app);
require("./src/routes/Crypto/crypto.route")(app);
require("./src/routes/Bookmark/bookmark.route")(app);
require("./src/routes/RssField/rssField.route")(app);
require("./src/routes/Picture/picture.routes")(app);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const safeMessage =
    status === 500 ? "Une erreur interne est survenue." : err.message;
  logger.error("Unhandled error", { status, message: err.message, stack: err.stack });
  res.status(status).json({
    status: "error",
    message: safeMessage,
    traceId: req.id,
  });
});

module.exports = app;
