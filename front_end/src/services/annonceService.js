import api from "./api";

export const getAnnonces = async () => {
  const res = await api.get("/annonces");
  return res.data;
};

export const getAnnonceById = async (id) => {
  const res = await api.get(`/annonces/${id}`);
  return res.data;
};

export const createAnnonce = async (data) => {
  const res = await api.post("/annonces", data);
  return res.data;
};

export const updateAnnonce = async (id, data) => {
  const res = await api.put(`/annonces/${id}`, data);
  return res.data;
};

export const deleteAnnonce = async (id) => {
  const res = await api.delete(`/annonces/${id}`);
  return res.data;
};
