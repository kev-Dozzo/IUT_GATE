import api from "./api";

export const getActualites = async () => {
  const res = await api.get("/actualites");
  return res.data;
};

export const getActualiteById = async (id) => {
  const res = await api.get(`/actualites/${id}`);
  return res.data;
};

export const createActualite = async (data, photos) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v != null) formData.append(k, v);
  });
  if (photos?.length > 0) {
    photos.forEach((photo) => formData.append("photos", photo));
  }
  const res = await api.post("/actualites", formData);
  return res.data;
};

export const updateActualite = async (id, data, photos) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v != null) formData.append(k, v);
  });
  if (photos?.length > 0) {
    photos.forEach((photo) => formData.append("photos", photo));
  }
  const res = await api.put(`/actualites/${id}`, formData);
  return res.data;
};

export const deleteActualite = async (id) => {
  const res = await api.delete(`/actualites/${id}`);
  return res.data;
};
