import api from "./api";

export const getSalles = async () => {
  const res = await api.get("/salles");
  return res.data;
};

export const getSalleById = async (id) => {
  const res = await api.get(`/salles/${id}`);
  return res.data;
};

export const createSalle = async (data) => {
  const res = await api.post("/salles", data);
  return res.data;
};

export const updateSalle = async (id, data) => {
  const res = await api.put(`/salles/${id}`, data);
  return res.data;
};

export const deleteSalle = async (id) => {
  const res = await api.delete(`/salles/${id}`);
  return res.data;
};
