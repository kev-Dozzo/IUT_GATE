const PERMISSIONS = {
  // Contenu
  manage_actualites: "Gérer les actualités",
  manage_filieres: "Gérer les filières",
  manage_departements: "Gérer les départements",
  manage_enseignants: "Gérer les enseignants",
  manage_batiments: "Gérer les bâtiments",
  manage_salles: "Gérer les salles",
  manage_services: "Gérer les services administratifs",
  manage_partenaires: "Gérer les partenaires",
  manage_programmes: "Gérer les programmes scolaires",
  manage_calendrier: "Gérer le calendrier académique",

  // Administration
  manage_users: "Gérer les utilisateurs admin",
  view_logs: "Voir l'historique des activités",
};

// Permissions par défaut selon le rôle
const ROLE_PERMISSIONS = {
  super_admin: ["all"], // accès total
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

module.exports = { PERMISSIONS, ROLE_PERMISSIONS };
