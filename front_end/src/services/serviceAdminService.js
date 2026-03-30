import api from "./api";

export const getServices = async () => {
  const res = await api.get("/servicesadmin");
  return res.data;
};

export const getServiceById = async (id) => {
  const res = await api.get(`/servicesadmin${id}`);
  return res.data;
};

export const createService = async (data) => {
  const res = await api.post("/servicesadmin", data);
  return res.data;
};

export const updateService = async (id, data) => {
  const res = await api.put(`/servicesadmin/${id}`, data);
  return res.data;
};

export const deleteService = async (id) => {
  const res = await api.delete(`/servicesadmin/${id}`);
  return res.data;
};
