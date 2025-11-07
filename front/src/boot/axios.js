import { boot } from "quasar/wrappers";
import axios from "axios";
import { UseGlobal } from "stores/global";
import createLogger from "src/utils/logger";

const logger = createLogger("http");
const FALLBACK_BASE_URL = "http://localhost:8080/api";

const normalizeBaseUrl = (value) =>
  (value || FALLBACK_BASE_URL).replace(/\/+$/, "");

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  timeout: 15000,
});

const resolveToken = (rawToken) => {
  if (Array.isArray(rawToken)) {
    return rawToken[0];
  }
  return rawToken;
};

api.interceptors.request.use(
  (config) => {
    const store = UseGlobal();
    const token = resolveToken(store.getAccessToken);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = config.headers.Authorization || `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logger.error("Axios request error", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    logger.warn("Axios response error", { status, url });
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
