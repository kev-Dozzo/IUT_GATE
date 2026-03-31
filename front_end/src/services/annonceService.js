import api from "./api";

export const getAnnonces = async () => {
  const res = await api.get("/actualiters");
  return res.data;
};

export const getAnnonceById = async (id) => {
  const res = await api.get(`/actualiters/${id}`);
  return res.data;
};

export const createAnnonce = async (data) => {
  const res = await api.post("/actualiters", data);
  return res.data;
};

export const updateAnnonce = async (id, data) => {
  const res = await api.put(`/actualiters/${id}`, data);
  return res.data;
};

export const deleteAnnonce = async (id) => {
  const res = await api.delete(`/actualiters/${id}`);
  return res.data;
};
