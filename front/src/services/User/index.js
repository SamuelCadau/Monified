import { api } from "boot/axios";
import URL, {
  AUTH_GOOGLE_SUCCESS,
  AUTH_PASSWORD_RESET,
  userPasswordEndpoint,
} from "src/helpers/Contants";

const WITH_CREDENTIALS = { withCredentials: true };

export default {
  getUser: (id) => api.get(`${URL.API_USER}/${id}`),
  getUserGoogle: () => api.get(AUTH_GOOGLE_SUCCESS, WITH_CREDENTIALS),
  uploadFile: (data) =>
    api.post(`${URL.API_PICTURE}/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAllUsers: () => api.get(URL.API_USER),
  register: (user) => api.post(URL.AUTH_REGISTER, user),
  login: (user) => api.post(URL.AUTH_LOGIN, user),
  googleLogin: () => api.get(URL.AUTH_GOOGLE, WITH_CREDENTIALS),
  microsoftLogin: () => api.get(URL.AUTH_MICROSOFT, WITH_CREDENTIALS),
  updateUser: (id, user) => api.put(`${URL.API_USER}/${id}`, user),
  deleteUser: (id) => api.delete(`${URL.API_USER}/${id}`),
  googleLogout: () => api.get(`${URL.AUTH_GOOGLE}/logout`, WITH_CREDENTIALS),
  microsoftLogout: () =>
    api.get(`${URL.AUTH_MICROSOFT}/logout`, WITH_CREDENTIALS),
  requestPasswordReset: (email) => api.post(AUTH_PASSWORD_RESET, { email }),
  updatePassword: (id, payload) =>
    api.put(userPasswordEndpoint(id), payload),
};
