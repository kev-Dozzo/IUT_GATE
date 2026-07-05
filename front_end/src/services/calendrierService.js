import api from "./api";

export const getEvenements = (cycle) =>
  api.get("/calendrier", { params: { cycle } }).then((r) => r.data);
export const createEvenement = (data) =>
  api.post("/calendrier", data).then((r) => r.data);
export const updateEvenement = (id, d) =>
  api.put(`/calendrier/${id}`, d).then((r) => r.data);
export const deleteEvenement = (id) =>
  api.delete(`/calendrier/${id}`).then((r) => r.data);
