import { loginDoctor } from "../api/authApi";

export const doctorLogin = async (values) => {
  const response = await loginDoctor(values);

  return response.data;
};