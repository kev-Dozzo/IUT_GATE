import api from "./api";

export const getDepartements = async () => {
  const res = await api.get("/departements");
  return res.data;
};

export const getDepartementById = async (id) => {
  const res = await api.get(`/departements/${id}`);
  return res.data;
};

export const getDepartementCount = async () => {
  const res = await api.get("/departements/count");
  return res.data.count;
};

export const createDepartement = async (data, photo) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value != null) formData.append(key, value);
  });
  if (photo) formData.append("photo", photo);
  const res = await api.post("/departements", formData);
  return res.data;
};

export const updateDepartement = async (id, data, photo) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value != null) formData.append(key, value);
  });
  if (photo) formData.append("photo", photo);
  const res = await api.put(`/departements/${id}`, formData);
  return res.data;
};

export const deleteDepartement = async (id) => {
  const res = await api.delete(`/departements/${id}`);
  return res.data;
};
