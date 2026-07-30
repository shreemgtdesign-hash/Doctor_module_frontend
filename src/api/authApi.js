import api from "./axios";

export const loginDoctor = (data) => {
  return api.post("/auth/staff/login", data);
};