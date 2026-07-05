export const ROLE_PERMISSIONS = {
  super_admin: ["all"],
  admin: [
    "manage_actualites",
    "manage_filieres",
    "manage_departements",
    "manage_enseignants",
    "manage_batiments",
    "manage_salles",
    "manage_services",
    "view_logs",
  ],
  editeur: ["manage_actualites"],
};

export const hasPermission = (admin, permission) => {
  if (!admin) return false;
  if (admin.role === "super_admin") return true;
  if (admin.permissions?.includes("all")) return true;
  return admin.permissions?.includes(permission) || false;
};
