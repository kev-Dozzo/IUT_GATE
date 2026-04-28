// Associations centralisées pour éviter les dépendances circulaires
const Batiment = require("./Batiment");
const Salle = require("./Salle");
const Departement = require("./Departement");
const Enseignant = require("./Enseignant");
const Filiere = require("./Filiere");
const ServiceAdministratif = require("./ServiceAdmin");

// Batiment <-> Salle
Batiment.hasMany(Salle, { foreignKey: "id_batiment", as: "salles" });
Salle.belongsTo(Batiment, { foreignKey: "id_batiment", as: "batiment" });

// Departement <-> Enseignant
Departement.hasMany(Enseignant, {
  foreignKey: "id_departement",
  as: "enseignants",
});
Enseignant.belongsTo(Departement, {
  foreignKey: "id_departement",
  as: "departement",
});

// Departement <-> Filiere
Departement.hasMany(Filiere, { foreignKey: "id_departement", as: "filieres" });
Filiere.belongsTo(Departement, {
  foreignKey: "id_departement",
  as: "departement",
});

// Enseignant <-> Batiment
Enseignant.belongsTo(Batiment, { foreignKey: "id_batiment", as: "batiment" });

// ServiceAdministratif <-> Batiment
ServiceAdministratif.belongsTo(Batiment, {
  foreignKey: "id_batiment",
  as: "batiment",
});
Batiment.hasMany(ServiceAdministratif, {
  foreignKey: "id_batiment",
  as: "services",
});

console.log("✅ Associations Sequelize chargées");
