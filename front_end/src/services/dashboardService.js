import api from "./api";

export const getStats = async () => {
  const [annonces, enseignants, filieres, services] = await Promise.all([
    api.get("/annonces/count"),
    api.get("/enseignants/count"),
    api.get("/filieres/count"),
    api.get("/services/count"),
  ]);
  return {
    annonces: annonces.data.count,
    enseignants: enseignants.data.count,
    filieres: filieres.data.count,
    services: services.data.count,
  };
};
