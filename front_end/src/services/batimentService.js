import api from "./api";

export const getBatiments = async () => {
  const res = await api.get("/batiments");
  return res.data;
};

export const getBatimentById = async (id) => {
  const res = await api.get(`/batiments/${id}`);
  return res.data;
};

export const createBatiment = async (data) => {
  const res = await api.post("/batiments", data);
  return res.data;
};

export const updateBatiment = async (id, data) => {
  const res = await api.put(`/batiments/${id}`, data);
  return res.data;
};

export const deleteBatiment = async (id) => {
  const res = await api.delete(`/batiments/${id}`);
  return res.data;
};
