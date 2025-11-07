const config = require("../config/env");

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const resolveLevel = (level) => LEVELS[level] ?? LEVELS.info;
const configuredLevel = resolveLevel(
  (config.logger.level || "info").toLowerCase()
);

const formatNamespace = (namespace) =>
  namespace ? `[${namespace}]` : "[monified]";

const createLogger = (namespace) => {
  const prefix = formatNamespace(namespace);

  const log = (level, ...args) => {
    if (config.logger.silent) {
      return;
    }
    if (resolveLevel(level) > configuredLevel) {
      return;
    }
    const date = new Date().toISOString();
    const payload = [`${date} ${prefix}`].concat(args);
    switch (level) {
      case "error":
        console.error(...payload); // eslint-disable-line no-console
        break;
      case "warn":
        console.warn(...payload); // eslint-disable-line no-console
        break;
      case "debug":
        console.debug(...payload); // eslint-disable-line no-console
        break;
      default:
        console.info(...payload); // eslint-disable-line no-console
    }
  };

  return {
    error: (...args) => log("error", ...args),
    warn: (...args) => log("warn", ...args),
    info: (...args) => log("info", ...args),
    debug: (...args) => log("debug", ...args),
    child: (childNamespace) =>
      createLogger(`${prefix.slice(0, -1)}:${childNamespace}]`),
  };
};

module.exports = createLogger;
