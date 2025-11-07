import { api } from "boot/axios";
import URL from "src/helpers/Contants";

export default {
  getRole: (id) => api.get(`${URL.API_ROLE}/${id}`),
  getAllRoles: () => api.get(URL.API_ROLE),
  createRole: (role) => api.post(URL.API_ROLE, role),
  updateRole: (id, role) => api.put(`${URL.API_ROLE}/${id}`, role),
  deleteRole: (id) => api.delete(`${URL.API_ROLE}/${id}`),
};
