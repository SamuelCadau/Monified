import { api } from "boot/axios";
import URL from "src/helpers/Contants";
import moment from "moment";

const buildTimeRange = (preset) => {
  const now = moment();
  switch (preset) {
    case "15m":
      return {
        start: now.clone().subtract(15, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        end: now.format("YYYY-MM-DD"),
        interval: "1m",
      };
    case "1H":
      return {
        start: now.clone().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
        end: now.format("YYYY-MM-DD"),
        interval: "1m",
      };
    case "4H":
      return {
        start: now.clone().subtract(4, "hours").format("YYYY-MM-DD HH:mm:ss"),
        end: now.format("YYYY-MM-DD"),
        interval: "1m",
      };
    case "1D":
      return {
        start: now.clone().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        end: now.format("YYYY-MM-DD"),
        interval: "1h",
      };
    case "1W":
      return {
        start: now.clone().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
        end: now.format("YYYY-MM-DD"),
        interval: "1h",
      };
    default:
      return {
        start: now.clone().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        end: now.format("YYYY-MM-DD"),
        interval: "1h",
      };
  }
};

export default {
  getCrypto: (id) => api.get(`${URL.API_CRYPTO}/${id}`),
  getAllCryptos: () => api.get(URL.API_CRYPTO),
  getCandleStickCrypto: (symbol, preset) => {
    const range = buildTimeRange(preset);
    return api.get(`${URL.API_CRYPTO}/candlestick`, {
      params: {
        symbol,
        start: range.start,
        end: range.end,
        interval: range.interval,
      },
    });
  },
  getPriceCrypto: (symbol) =>
    api.get(`${URL.API_CRYPTO}/price`, { params: { symbol } }),
  getNewsCryptos: () => api.get(`${URL.API_CRYPTO}/news`),
  createCrypto: (crypto) => api.post(URL.API_CRYPTO, crypto),
  updateCrypto: (id, crypto) => api.put(`${URL.API_CRYPTO}/${id}`, crypto),
  deleteCrypto: (id) => api.delete(`${URL.API_CRYPTO}/${id}`),
  getBitcoin: () => api.get(`${URL.API_CRYPTO}/bitcoin`),
};
