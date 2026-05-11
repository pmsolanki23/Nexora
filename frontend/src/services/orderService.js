import api from "./api";

export const placeCODOrder = async (data) => {
  const response = await api.post("/api/order/cod", data);

  return response.data;
};

export const placeStripeOrder = async (data) => {
  const response = await api.post("/api/order/stripe", data);

  return response.data;
};

export const placeRazorpayOrder = async (data) => {
  const response = await api.post("/api/order/razorpay", data);

  return response.data;
};

export const userOrders = async () => {
  const response = await api.post("/api/order/userorders");

  return response.data;
};
