import api from "./api";

export const getActivities = async () => {
  const res = await api.get("/activities");
  return res.data;
};

export const getActivitiesByAdmin = async (id) => {
  const res = await api.get(`/activities/${id}`);
  return res.data;
};
