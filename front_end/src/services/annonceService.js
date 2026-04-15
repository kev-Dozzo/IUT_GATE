import api from "./api";

export const getAnnonces = async () => {
  const res = await api.get("/actualiter");
  return res.data;
};

export const getAnnonceById = async (id) => {
  const res = await api.get(`/actualiter/${id}`);
  return res.data;
};

export const createAnnonce = async (data) => {
  const res = await api.post("/actualiter", data);
  return res.data;
};

export const updateAnnonce = async (id, data) => {
  const res = await api.put(`/actualiter/${id}`, data);
  return res.data;
};

export const deleteAnnonce = async (id) => {
  const res = await api.delete(`/actualiter/${id}`);
  return res.data;
};
