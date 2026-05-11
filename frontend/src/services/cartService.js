import api from "./api";

export const addCart = async (itemId, size) => {
  const response = await api.post("/api/cart/add", {
    itemId,
    size,
  });

  return response.data;
};

export const updateCart = async (itemId, size, quantity) => {
  const response = await api.post("/api/cart/update", {
    itemId,
    size,
    quantity,
  });

  return response.data;
};

export const getCart = async () => {
  const response = await api.post("/api/cart/get");

  return response.data;
};
