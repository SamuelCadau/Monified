const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const resolveLevel = (value) => {
  if (!value) {
    return undefined;
  }
  return LEVELS[String(value).toLowerCase()];
};

const envLevel =
  resolveLevel(import.meta.env.VITE_LOG_LEVEL) ??
  (import.meta.env.PROD ? LEVELS.warn : LEVELS.debug);

const shouldLog = (level) =>
  !import.meta.env.PROD && level <= envLevel;

const formatNamespace = (namespace) =>
  namespace ? `[${namespace}]` : "[monified-front]";

const output = (method, prefix, payload) => {
  const timestamp = new Date().toISOString();
  if (method in console) {
    console[method](`${timestamp} ${prefix}`, ...payload); // eslint-disable-line no-console
  } else {
    console.log(`${timestamp} ${prefix}`, ...payload); // eslint-disable-line no-console
  }
};

const createLogger = (namespace) => {
  const prefix = formatNamespace(namespace);

  const log = (levelName, consoleMethod, args) => {
    const resolved = LEVELS[levelName];
    if (!shouldLog(resolved)) {
      return;
    }
    output(consoleMethod, prefix, args);
  };

  return {
    error: (...args) => log("error", "error", args),
    warn: (...args) => log("warn", "warn", args),
    info: (...args) => log("info", "info", args),
    debug: (...args) => log("debug", "debug", args),
  };
};

export default createLogger;
