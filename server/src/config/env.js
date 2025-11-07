const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const discoveredEnvFiles = [
  process.env.MONIFIED_ENV_PATH,
  path.resolve(__dirname, "../../.env"),
  path.resolve(process.cwd(), ".env"),
].filter(Boolean);

for (const candidate of discoveredEnvFiles) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
}

const bool = (value, fallback = false) => {
  if (value === undefined || value === null) {
    return fallback;
  }
  const normalized = String(value).trim().toLowerCase();
  if (["true", "1", "yes", "y", "on"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "n", "off"].includes(normalized)) {
    return false;
  }
  return fallback;
};

const number = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const envName = process.env.NODE_ENV || "development";
const defaultLoggerLevel = envName === "production" ? "warn" : "debug";

const config = {
  env: envName,
  isTest: envName === "test",
  isProduction: envName === "production",
  server: {
    port: number(process.env.PORT, 8080),
    corsOrigin: process.env.CLIENT_ORIGIN || "http://localhost:8000",
  },
  logger: {
    level: process.env.LOG_LEVEL || defaultLoggerLevel,
    silent: envName === "test",
  },
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: number(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || "countofmoney",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || process.env.DB_PASS || "",
    dialect: (process.env.DB_DIALECT || "mysql").toLowerCase(),
    storage: process.env.DB_STORAGE || ":memory:",
    logging: bool(process.env.DB_LOGGING, false),
    sync: (process.env.DB_SYNC || "safe").toLowerCase(), // safe | alter | force | skip
    poolMin: number(process.env.DB_POOL_MIN, 0),
    poolMax: number(process.env.DB_POOL_MAX, 5),
  },
  bootstrap: {
    seedCoreData: bool(process.env.SEED_CORE_DATA, false),
    refreshCryptoOnBoot: bool(process.env.BOOTSTRAP_CRYPTO_DATA, false),
    cryptoRefreshIntervalMs: number(
      process.env.CRYPTO_REFRESH_INTERVAL_MS,
      6 * 60 * 60 * 1000
    ),
  },
  security: {
    sessionSecret: process.env.SESSION_SECRET || "change-me",
    tempPassword: process.env.TEMP_PASSWORD || "ChangeMe123!",
    jwtSecret:
      process.env.JWT_SECRET || process.env.SECRET_KEY || "change-me-jwt",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        process.env.GOOGLE_CALLBACK_URI ||
        "http://localhost:8080/api/auth/google/callback",
    },
    microsoft: {
      clientId: process.env.MS_CLIENT_ID || process.env.MICROSOFT_CLIENT_ID || "",
      clientSecret:
        process.env.MS_CLIENT_SECRET || process.env.MICROSOFT_CLIENT_SECRET || "",
      callbackURL:
        process.env.MS_CALLBACK_URL ||
        process.env.MICROSOFT_CALLBACK_URI ||
        "http://localhost:8080/api/auth/microsoft/callback",
      tenantId: process.env.MS_TENANT_ID || process.env.MICROSOFT_TENANT_ID || "common",
    },
  },
  binance: {
    apiKey: process.env.BINANCE_API_KEY || "",
    secretKey: process.env.BINANCE_SECRET_KEY || "",
  },
  mail: {
    host: process.env.SMTP_HOST || "",
    port: number(process.env.SMTP_PORT, 587),
    secure: bool(process.env.SMTP_SECURE, false),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "no-reply@monified.local",
    frontendBaseUrl:
      process.env.FRONTEND_BASE_URL ||
      process.env.CLIENT_ORIGIN ||
      "http://localhost:8000",
  },
};

module.exports = config;
