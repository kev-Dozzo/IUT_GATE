import api from "./api";

export const getProgrammes = (cycle) =>
  api.get("/programmes", { params: { cycle } }).then((r) => r.data);
export const getProgrammesAdmin = () =>
  api.get("/programmes/admin").then((r) => r.data);
export const createProgramme = (data) =>
  api.post("/programmes", data).then((r) => r.data);
export const updateProgramme = (id, d) =>
  api.put(`/programmes/${id}`, d).then((r) => r.data);
export const deleteProgramme = (id) =>
  api.delete(`/programmes/${id}`).then((r) => r.data);
