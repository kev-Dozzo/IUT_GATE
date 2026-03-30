import api from "./api";

export const getServices = async () => {
<<<<<<< HEAD
  const res = await api.get("/services");
=======
  const res = await api.get("/servicesadmin");
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};

export const getServiceById = async (id) => {
<<<<<<< HEAD
  const res = await api.get(`/services/${id}`);
=======
  const res = await api.get(`/servicesadmin${id}`);
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};

export const createService = async (data) => {
<<<<<<< HEAD
  const res = await api.post("/services", data);
=======
  const res = await api.post("/servicesadmin", data);
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};

export const updateService = async (id, data) => {
<<<<<<< HEAD
  const res = await api.put(`/services/${id}`, data);
=======
  const res = await api.put(`/servicesadmin/${id}`, data);
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};

export const deleteService = async (id) => {
<<<<<<< HEAD
  const res = await api.delete(`/services/${id}`);
=======
  const res = await api.delete(`/servicesadmin/${id}`);
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};
