import api from "./api";

export const getBatiments = async () => {
  const res = await api.get("/batiments");
  return res.data;
};

export const getBatimentById = async (id) => {
  const res = await api.get(`/batiments/${id}`);
  return res.data;
};

export const getBatimentCount = async () => {
  const res = await api.get("/batiments/count");
  return res.data.count;
};

export const createBatiment = async (data, photo) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v != null) formData.append(k, v);
  });
  if (photo) formData.append("photo", photo);
  const res = await api.post("/batiments", formData);
  return res.data;
};

export const updateBatiment = async (id, data, photo) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v != null) formData.append(k, v);
  });
  if (photo) formData.append("photo", photo);
  const res = await api.put(`/batiments/${id}`, formData);
  return res.data;
};

export const deleteBatiment = async (id) => {
  const res = await api.delete(`/batiments/${id}`);
  return res.data;
};
