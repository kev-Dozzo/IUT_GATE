import api from "./api";

export const getStats = async () => {
  const [actualites, enseignants, filieres, services] = await Promise.all([
    api.get("/actualites/count"),
    api.get("/enseignants/count"),
    api.get("/filieres/count"),
    api.get("/services/count"),
  ]);
  return {
    actualites: actualites.data.count,
    enseignants: enseignants.data.count,
    filieres: filieres.data.count,
    services: services.data.count,
  };
};
