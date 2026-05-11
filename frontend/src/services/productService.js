import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/api/product/list");

  return response.data;
};

export const getSingleProduct = async (productId) => {
  const response = await api.post("/api/product/single", {
    productId,
  });

  return response.data;
};
