import api from "./api";

export const getEnseignants = async () => {
  const res = await api.get("/enseignants");
  return res.data;
};

export const getEnseignantById = async (id) => {
  const res = await api.get(`/enseignants/${id}`);
  return res.data;
};

export const createEnseignant = async (data) => {
  const res = await api.post("/enseignants", data);
  return res.data;
};

export const updateEnseignant = async (id, data) => {
  const res = await api.put(`/enseignants/${id}`, data);
  return res.data;
};

export const deleteEnseignant = async (id) => {
  const res = await api.delete(`/enseignants/${id}`);
  return res.data;
};
