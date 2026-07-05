import api from "./api";

export const getAdmins = async () => {
  const res = await api.get("/auth/admins");
  return res.data;
};

export const createAdmin = async (data) => {
  const res = await api.post("/auth/admins", data);
  return res.data;
};

export const updateAdmin = async (id, data) => {
  const res = await api.put(`/auth/admins/${id}`, data);
  return res.data;
};

export const deleteAdmin = async (id) => {
  const res = await api.delete(`/auth/admins/${id}`);
  return res.data;
};
