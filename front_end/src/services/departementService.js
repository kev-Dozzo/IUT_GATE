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

export const createDepartement = async (data) => {
  const res = await api.post("/departements", data);
  return res.data;
};

export const updateDepartement = async (id, data) => {
  const res = await api.put(`/departements/${id}`, data);
  return res.data;
};

export const deleteDepartement = async (id) => {
  const res = await api.delete(`/departements/${id}`);
  return res.data;
};
