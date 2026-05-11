import api from "./api";

export const adminLogin = async (data) => {
  const response = await api.post("/api/auth/admin", data);

  return response.data;
};
