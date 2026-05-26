import api from "./api";

export const getDebouches = async (prompt) => {
  const res = await api.post("/ia/debouches", { prompt });
  return res.data;
};

export const getIAStatus = async () => {
  const res = await api.get("/ia/status");
  return res.data;
};
