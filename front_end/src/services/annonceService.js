import api from "./api";

export const getAnnonces = async () => {
<<<<<<< HEAD
  const res = await api.get("/annonces");
=======
  const res = await api.get("/actualiters");
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};

export const getAnnonceById = async (id) => {
<<<<<<< HEAD
  const res = await api.get(`/annonces/${id}`);
=======
  const res = await api.get(`/actualiters/${id}`);
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};

export const createAnnonce = async (data) => {
<<<<<<< HEAD
  const res = await api.post("/annonces", data);
=======
  const res = await api.post("/actualiters", data);
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};

export const updateAnnonce = async (id, data) => {
<<<<<<< HEAD
  const res = await api.put(`/annonces/${id}`, data);
=======
  const res = await api.put(`/actualiters/${id}`, data);
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};

export const deleteAnnonce = async (id) => {
<<<<<<< HEAD
  const res = await api.delete(`/annonces/${id}`);
=======
  const res = await api.delete(`/actualiters/${id}`);
>>>>>>> 4e485acb05f89501a047512e9a31571d5c0847e4
  return res.data;
};
