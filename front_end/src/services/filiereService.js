import api from "./api";

export const getFilieres = async () => {
  const res = await api.get("/filieres");
  return res.data;
};

export const getFiliereById = async (id) => {
  const res = await api.get(`/filieres/${id}`);
  return res.data;
};

export const createFiliere = async (data) => {
  const res = await api.post("/filieres", data);
  return res.data;
};

export const updateFiliere = async (id, data) => {
  const res = await api.put(`/filieres/${id}`, data);
  return res.data;
};

export const deleteFiliere = async (id) => {
  const res = await api.delete(`/filieres/${id}`);
  return res.data;
};
