import api from "./api";

export const getStats = async () => {
  const [annonces, enseignants, filieres, services, batiments, salles] = await Promise.all([
    api.get("/annonces/count"),
    api.get("/enseignants/count"),
    api.get("/filieres/count"),
    api.get("/services/count"),
    api.get("/batiments/count"),
    api.get("/salles/count"),
  ]);
  return {
    annonces: annonces.data.count,
    enseignants: enseignants.data.count,
    filieres: filieres.data.count,
    services: services.data.count,
    batiments: batiments.data.count,
    salles: salles.data.count,
  };
};
