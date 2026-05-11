import api from "./api";

export const getOrders = async () => {
  const response = await api.post("/api/order/list");

  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.post("/api/order/status", {
    orderId,
    status,
  });

  return response.data;
};
