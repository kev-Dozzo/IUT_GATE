import api from "./api";

export const getFilieres = async () => {
  const res = await api.get("/filieres");
  return res.data;
};

export const getFiliereById = async (id) => {
  const res = await api.get(`/filieres/${id}`);
  return res.data;
};

export const createFiliere = async (data, photo) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v != null) formData.append(k, v);
  });
  if (photo) formData.append("photo", photo);
  const res = await api.post("/filieres", formData);
  return res.data;
};

export const updateFiliere = async (id, data, photo) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v != null) formData.append(k, v);
  });
  if (photo) formData.append("photo", photo);
  const res = await api.put(`/filieres/${id}`, formData);
  return res.data;
};

export const deleteFiliere = async (id) => {
  const res = await api.delete(`/filieres/${id}`);
  return res.data;
};
