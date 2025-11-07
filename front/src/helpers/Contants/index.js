const FALLBACK_API_BASE_URL = "http://localhost:8080/api";

const normalize = (value) => (value || FALLBACK_API_BASE_URL).replace(/\/+$/, "");
const API_BASE_URL = normalize(import.meta.env.VITE_API_BASE_URL);
const API_ORIGIN = API_BASE_URL.replace(/\/api$/i, "");

const withApi = (path) => `${API_BASE_URL}${path}`;

export const API_USER = withApi("/users");
export const AUTH_LOGIN = withApi("/auth/login");
export const AUTH_REGISTER = withApi("/auth/register");
export const AUTH_MICROSOFT = withApi("/auth/microsoft");
export const AUTH_GOOGLE = withApi("/auth/google");
export const AUTH_GOOGLE_SUCCESS = withApi("/auth/google/success");
export const AUTH_MICROSOFT_SUCCESS = withApi("/auth/microsoft/success");
export const AUTH_PASSWORD_RESET = withApi("/auth/request-password-reset");
export const API_ROLE = withApi("/roles");
export const API_CRYPTO = withApi("/cryptos");
export const API_BOOKMARK = withApi("/bookmarks");
export const API_NEWS = withApi("/news");
export const API_PICTURE = withApi("/pictures");

export const buildAssetUrl = (relativePath = "") => {
  if (!relativePath) {
    return API_ORIGIN;
  }
  return `${API_ORIGIN}${relativePath}`;
};

export const userPasswordEndpoint = (userId) =>
  withApi(`/users/${userId}/password`);

const endpoints = {
  API_BASE_URL,
  API_ORIGIN,
  API_USER,
  AUTH_LOGIN,
  AUTH_REGISTER,
  AUTH_MICROSOFT,
  AUTH_GOOGLE,
  AUTH_GOOGLE_SUCCESS,
  AUTH_MICROSOFT_SUCCESS,
  AUTH_PASSWORD_RESET,
  API_ROLE,
  API_CRYPTO,
  API_BOOKMARK,
  API_NEWS,
  API_PICTURE,
  buildAssetUrl,
  userPasswordEndpoint,
};

export default endpoints;
