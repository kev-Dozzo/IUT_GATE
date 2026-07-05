import api from "./api";

const BASE =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export const getPartenaires = () => api.get("/partenaires").then((r) => r.data);
export const getPartenairesAdmin = () =>
  api.get("/partenaires/admin").then((r) => r.data);

export const createPartenaire = (formData) =>
  api
    .post("/partenaires", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const updatePartenaire = (id, formData) =>
  api
    .put(`/partenaires/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

export const deletePartenaire = (id) =>
  api.delete(`/partenaires/${id}`).then((r) => r.data);

export const getLogoUrl = (url) => (url ? `${BASE}${url}` : null);
