const Crypto = require("../../models/index")["Crypto"];
const Pic = require("../../models/index")["Picture"];
const User = require("../../models/index")["User"];
const qs = require("qs");
const Picture = require("../../services/Picture/picture.services");
const axios = require("axios");
const moment = require("moment");
const config = require("../../config/env");
const createLogger = require("../../utils/logger");

const logger = createLogger("service:crypto");
const apiKeys = config.binance.apiKey;

const { filterCryptoData } = require("../../helpers/index");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BINANCE_PUBLIC_BASE_URLS = [
  "https://api.binance.com",
  "https://api-gcp.binance.com",
  "https://api1.binance.com",
  "https://api2.binance.com",
  "https://api3.binance.com",
  "https://api4.binance.com",
  "https://data-api.binance.vision",
];
const BINANCE_KLINES_ENDPOINT = "/api/v3/klines";
const BINANCE_MAX_RETRIES = 3;
const BINANCE_REQUEST_TIMEOUT = 10_000;
const binanceRequestConfig = {
  timeout: BINANCE_REQUEST_TIMEOUT,
};

if (apiKeys) {
  binanceRequestConfig.headers = {
    "X-MBX-APIKEY": apiKeys,
  };
}

async function fetchBinanceKlines(params, contextLabel) {
  let lastError;
  const queryString = qs.stringify(params);
  for (const baseUrl of BINANCE_PUBLIC_BASE_URLS) {
    for (let attempt = 1; attempt <= BINANCE_MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get(
          `${baseUrl}${BINANCE_KLINES_ENDPOINT}?${queryString}`,
          binanceRequestConfig
        );
        return response.data;
      } catch (error) {
        lastError = error;
        const status = error.response?.status;
        if (status === 429 || status === 418) {
          const backoff = Math.min(5000, attempt * 1000);
          logger.warn(
            `Binance rate limit (${status}) for ${contextLabel} via ${baseUrl}. ` +
              `Retry ${attempt}/${BINANCE_MAX_RETRIES} in ${backoff}ms.`
          );
          await sleep(backoff);
          continue;
        }
        logger.warn(
          `Binance request failed for ${contextLabel} via ${baseUrl}: ${error.message}`
        );
        break;
      }
    }
  }
  const error =
    lastError || new Error(`Unable to fetch Binance data for ${contextLabel}`);
  logger.error("Binance klines fetch failed", { contextLabel, error });
  throw error;
}

/**
 * Cache pour éviter plusieurs bootstraps concurrents.
 */
let bootstrapPromise = null;

const fetchWithRelations = (model) =>
  model.findAll({
    include: [
      {
        model: User,
        as: "users",
      },
      {
        model: Pic,
        as: "picture",
      },
    ],
    order: [["historic", "DESC"]],
  });

class CryptoService {
  constructor() {
    this.crypto = Crypto;
  }

  /**
   * @param {Crypto} crypto
   * @returns {Promise<Crypto>}
   * @description Create crypto in db
   */
  async create(crypto) {
    return await this.crypto.create(crypto);
  }

  /**
   * @returns {Promise<Crypto[]>}
   * @description Return all cryptos
   */
  async findAll() {
    const cryptos = await fetchWithRelations(this.crypto);
    if (cryptos.length > 0) {
      return cryptos;
    }

    if (!bootstrapPromise) {
      logger.warn(
        "No cryptos found locally — triggering asynchronous bootstrap from Binance."
      );
      bootstrapPromise = this.setAllCryptoDB()
        .then((inserted) => {
          logger.info("Crypto bootstrap completed", { inserted });
        })
        .catch((error) => {
          logger.error("Failed to bootstrap cryptos from Binance", {
            message: error.message,
          });
        })
        .finally(() => {
          bootstrapPromise = null;
        });
    }

    return [];
  }

  /**
   * @param {Number} id
   * @returns {Promise<Crypto>}
   */
  async findOne(id) {
    return await this.crypto
      .findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: User,
            as: "users",
          },
          {
            model: Pic,
            as: "picture"
          },
        ],
      })
      .then((crypto) => {
        if (crypto) {
          return crypto;
        }
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  /**
   * @returns {Promise<Crypto>}
   * @description Find Bitcoin Crypto
   */
  async findBitcoin() {
    return await this.findBySymbol("BTCUSDT")
      .then((crypto) => {
        return crypto;
      })
      .catch(() => {
        throw new Error("Bitcoin not available");
      });
  }

  /**
   * @param {Number} id
   * @param {Crypto} crypto
   * @returns {Promise<Crypto>}
   */
  async update(id, crypto) {
    return await this.crypto
      .update(crypto, {
        where: {
          id: id,
        },
      })
      .then((crypto) => {
        if (crypto) {
          return crypto;
        }
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  /**
   * @param {Number} id
   * @returns {Promise<Crypto>}
   */
  async delete(id) {
    return await this.crypto
      .destroy({
        where: {
          id: id,
        },
      })
      .then((num) => {
        if (num == 1) {
          return this.findAll();
        }
      })
      .catch(() => {
        throw new Error("Crypto not found with id " + id);
      });
  }

  /**
   * @param {String} symbol
   * @returns {Promise<Crypto>}
   */
  async findBySymbol(symbol) {
    return await this.crypto
      .findOne({
        where: {
          symbol: symbol,
        },
      })
      .then((crypto) => {
        return crypto;
      })
      .catch(() => {
        throw new Error("Crypto not found with symbol " + symbol);
      });
  }

  /**
   * @param {String} symbol
   * @returns {Promise<Crypto>}
   * @description Get price of a crypto
   */
  async getPriceOfACrypto(symbol) {
    const crypto = await this.findBySymbol(symbol);
    return {
      symbol: crypto.symbol,
      price: crypto.price,
    };
  }

  /**
   * @param {String} symbol
   * @returns {Promise<Crypto>}
   * @description Checks if a crypto with the given symbol already exists
   */
  async cryptoExists(symbol) {
    const crypto = await this.findBySymbol(symbol);
    return crypto ? true : false;
  }

  /**
   * @returns {Promise<Crypto[]>}
   * @description Get all cryptos from Binance format USDT and create them in the database
   */
  async setAllCryptoDB() {
    const url = "https://www.binance.com/api/v3/ticker/price";
    try {
      const response = await axios.get(url);
      const filteredData = filterCryptoData(response.data);
      let processed = 0;

      for (const data of filteredData) {
        try {
          const tickerUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${data.symbol}`;
          const tickerResponse = await axios.get(tickerUrl);
          const ticker = tickerResponse.data;

          const lastPrice = parseFloat(ticker.lastPrice);
          if (Number.isNaN(lastPrice) || lastPrice <= 10) {
            continue;
          }

          const cryptoPayload = {
            symbol: data.symbol,
            price: lastPrice.toFixed(2),
            volume: parseFloat(ticker.volume).toFixed(2),
            variation: parseFloat(ticker.priceChangePercent).toFixed(2),
            historic: {},
          };

          processed += 1;

          if (lastPrice > 50) {
            const enriched = await this.getHistoricOfCrypto(cryptoPayload);
            const created = await this.create(enriched);
            const symb = data.symbol.slice(0, -4);
            try {
              await Picture.setPictureForAllCryptos(symb, created.dataValues.id);
            } catch (error) {
              logger.warn(`Unable to set picture for ${symb}`, {
                message: error.message,
              });
            }
            continue;
          }

          await this.create(cryptoPayload);
        } catch (innerError) {
          logger.warn("Skipping crypto entry due to upstream error", {
            symbol: data.symbol,
            message: innerError.message,
          });
        }
      }

      return processed;
    } catch (error) {
      logger.error("Failed to import Binance prices", error);
      throw error;
    }
  }

  /**
   * @param {String} symbol
   * @param {String[]} options
   * @returns {Promise<Crypto[]>}
   * @description Return candlestick data for a crypto
   */
  async getHistoricOfCrypto(crypto) {
    if (!crypto) {
      throw new Error("Crypto is required");
    }

    // SET ALL THE TIME
    const currentDate = moment().unix() * 1000;
    const oneHourAgo = moment().subtract(1, "hours").unix() * 1000;
    const fourHourAgo = moment().subtract(4, "hours").unix() * 1000;
    const sixHourAgo = moment().subtract(6, "hours").unix() * 1000;
    const eightHourAgo = moment().subtract(8, "hours").unix() * 1000;
    const twelveHourAgo = moment().subtract(12, "hours").unix() * 1000;
    const oneDayAgo = moment().subtract(1, "days").unix() * 1000;
    const threeDayAgo = moment().subtract(3, "days").unix() * 1000;
    const oneWeekAgo = moment().subtract(1, "weeks").unix() * 1000;
    const oneMonthAgo = moment().subtract(1, "months").unix() * 1000;

    const intervals = {
      hour: "1h",
      // fourHour: "4h",
      // sixHour: "6h",
      // eightHour: "8h",
      // twelveHour: "12h",
      // day: "1d",
      // threeDay: "3d",
      // week: "1w",
      // oneMonth: "1M",
    };

    const time = {
      // "1h": {
      //   start: oneHourAgo,
      //   end: currentDate,
      // },
      fourHour: {
        start: fourHourAgo,
        end: currentDate,
      },
      // "6h": {
      //   start: sixHourAgo,
      //   end: currentDate,
      // },
      // "8h": {
      //   start: eightHourAgo,
      //   end: currentDate,
      // },
      // "12h": {
      //   start: twelveHourAgo,
      //   end: currentDate,
      // },
      day: {
        start: oneDayAgo,
        end: currentDate,
      },
      // "3d": {
      //   start: threeDayAgo,
      //   end: currentDate,
      // },
      week: {
        start: oneWeekAgo,
        end: currentDate,
      },
      oneMonth: {
        start: oneMonthAgo,
        end: currentDate,
      },
    };

    let historic = {};
    for (let interval in intervals) {
      if (!intervals[interval]) {
        throw new Error(`Interval ${interval} is required`);
      }
      for (let timePeriod in time) {
        const { start, end } = time[timePeriod];
        const val = intervals[interval];
        const symbol = crypto.symbol;
        const queryParams = {
          symbol: `${symbol}`,
          interval: val,
          startTime: start,
          endTime: end,
          limit: 365,
        };
        const contextLabel = `${symbol} ${interval}/${timePeriod}`;
        const candles = await fetchBinanceKlines(queryParams, contextLabel);
        for (let bar of candles) {
          if (!historic[timePeriod]) {
            historic[timePeriod] = [];
          }
          historic[timePeriod].push({
            Symbol: crypto.symbol,
            Open: bar[1],
            Close: bar[4],
            High: bar[2],
            Low: bar[3],
            Volume: bar[5],
            Time: moment(bar[0]).format("YYYY-MM-DD HH:mm:ss"),
          });
        }
      }
    }

    Object.assign(crypto.historic, historic);
    return crypto;
  }
}

module.exports = CryptoService;
