import { api } from "boot/axios";
import URL from "src/helpers/Contants";

export default {
  getOneNews: (id) => api.get(`${URL.API_NEWS}/${id}`),
  getAllNews: () => api.get(URL.API_NEWS),
  deleteNews: (id) => api.delete(`${URL.API_NEWS}/${id}`),
};
