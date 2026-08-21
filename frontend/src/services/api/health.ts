import api from "./axios";

export const checkHealth = async () => {
  const response = await api.get("/health");

  return response.data;
};