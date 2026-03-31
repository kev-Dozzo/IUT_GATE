import api from "./api";

export const getEnseignants = async () => {
  const res = await api.get("/enseignants");
  return res.data;
};

export const getEnseignantById = async (id) => {
  const res = await api.get(`/enseignants/${id}`);
  return res.data;
};

export const createEnseignant = async (data, photo) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) formData.append(key, val);
  });
  if (photo) formData.append("photo", photo);
  const res = await api.post("/enseignants", formData);
  return res.data;
};

export const updateEnseignant = async (id, data, photo) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) formData.append(key, val);
  });
  if (photo) formData.append("photo", photo);
  const res = await api.put(`/enseignants/${id}`, formData);
  return res.data;
};

export const deleteEnseignant = async (id) => {
  const res = await api.delete(`/enseignants/${id}`);
  return res.data;
};
