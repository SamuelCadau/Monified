const app = require("./app");
const config = require("./src/config/env");
const createLogger = require("./src/utils/logger");
const db = require("./src/models");
const DatabaseService = require("./src/services/Database/database.services");
const CryptoService = require("./src/services/Crypto/crypto.services");
const RssFieldService = require("./src/services/RssField/rssField.services");

const logger = createLogger("server");
const databaseService = new DatabaseService();
const cryptoService = new CryptoService();
const rssFieldService = new RssFieldService();

const SYNC_STRATEGIES = {
  force: { force: true },
  alter: { alter: true },
  safe: {},
};

async function syncDatabase() {
  const strategy = config.db.sync;
  if (strategy === "skip") {
    logger.info("Database sync skipped (DB_SYNC=skip)");
    return;
  }
  const syncOptions = SYNC_STRATEGIES[strategy] || SYNC_STRATEGIES.safe;
  await db.sequelize.sync(syncOptions);
  logger.info(`Database synchronized with strategy "${strategy}"`);
}

async function seedCoreData() {
  if (!config.bootstrap.seedCoreData) {
    logger.debug("Seed skipped (SEED_CORE_DATA=false)");
    return;
  }
  await databaseService.createMandatoryRoles();
  await databaseService.createMandatoryUsers();
  await rssFieldService.cryptoNews();
  logger.info("Mandatory roles/users/rss feeds ensured.");
}

async function warmupCryptoData() {
  if (!config.bootstrap.refreshCryptoOnBoot) {
    logger.debug("Crypto bootstrap skipped (BOOTSTRAP_CRYPTO_DATA=false)");
    return;
  }
  await cryptoService.setAllCryptoDB();
  logger.info("Crypto cache refreshed from Binance.");
}

function scheduleCryptoRefresh() {
  if (!config.bootstrap.refreshCryptoOnBoot) {
    return;
  }
  const interval = config.bootstrap.cryptoRefreshIntervalMs;
  if (!interval || interval <= 0) {
    return;
  }
  setInterval(() => {
    cryptoService
      .setAllCryptoDB()
      .then(() => logger.debug("Crypto cache refreshed (scheduled)."))
      .catch((error) => logger.error("Unable to refresh crypto cache", error));
  }, interval);
}

async function start() {
  try {
    await db.sequelize.authenticate();
    logger.info("Database connection established.");
    await syncDatabase();
    await seedCoreData();
    await warmupCryptoData();
    scheduleCryptoRefresh();

    const server = app.listen(config.server.port, () => {
      logger.info(`Server listening on port ${config.server.port}`);
    });

    server.on("error", (error) => {
      logger.error("HTTP server error", error);
    });
  } catch (error) {
    logger.error("Fatal startup error", error);
    process.exit(1);
  }
}

start();
