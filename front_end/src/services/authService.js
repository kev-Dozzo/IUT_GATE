import api from "./api";

export const login = async (email, mot_de_passe) => {
  const res = await api.post("/auth/login", { email, mot_de_passe });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token, mot_de_passe) => {
  const res = await api.post("/auth/reset-password", { token, mot_de_passe });
  return res.data;
};
