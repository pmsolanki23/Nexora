import api from "./api";

export const addProduct = async (formData) => {
  const response = await api.post("/api/product/add", formData);

  return response.data;
};

export const getProducts = async () => {
  const response = await api.get("/api/product/list");

  return response.data;
};

export const updateProduct = async (formData) => {
  const response = await api.post("/api/product/update", formData);

  return response.data;
};

export const removeProduct = async (id) => {
  const response = await api.post("/api/product/remove", { id });

  return response.data;
};
