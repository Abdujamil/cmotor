import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://crystal-motors.ru",
  headers: {
    "Content-Type": "application/json"
  }
});

export default {
  getSendings() {
    return apiClient.get("/method.getSendings");
  },
  getSending(id) {
    return apiClient.get(`/method.getSending`, { params: { id } });
  },
  addSending(data) {
    return apiClient.post("/method.addSending", data);
  },
  editSending(id, data) {
    return apiClient.put(`/method.editSending`, { id, ...data });
  },
  deleteSending(id) {
    return apiClient.delete(`/method.deleteSending`, { params: { id } });
  }
};
