const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const sequelize = require("./config/database");

// ── MODÈLES ──
const Admin = require("./models/Admin");
const Actualite = require("./models/Actualiter");
const Departement = require("./models/Departement");
const Filiere = require("./models/Filiere");
const StaffEnseignant = require("./models/Enseignant");
const Batiment = require("./models/Batiment");
const Salle = require("./models/Salle");
const ServiceAdministratif = require("./models/ServiceAdmin");
const ActualitePhoto = require("./models/ActualitePhoto");

// ── ASSOCIATIONS ──
Departement.hasMany(Filiere, { foreignKey: "id_departement", as: "filieres" });
Filiere.belongsTo(Departement, {
  foreignKey: "id_departement",
  as: "departement",
});

Departement.hasMany(StaffEnseignant, {
  foreignKey: "id_departement",
  as: "enseignants",
});
StaffEnseignant.belongsTo(Departement, {
  foreignKey: "id_departement",
  as: "departement",
});

Batiment.hasMany(Salle, { foreignKey: "id_batiment", as: "salles" });
Salle.belongsTo(Batiment, { foreignKey: "id_batiment", as: "batiment" });

Batiment.hasMany(StaffEnseignant, {
  foreignKey: "id_batiment",
  as: "enseignants_batiment",
});
StaffEnseignant.belongsTo(Batiment, {
  foreignKey: "id_batiment",
  as: "batiment",
});

Batiment.hasMany(ServiceAdministratif, {
  foreignKey: "id_batiment",
  as: "services",
});
ServiceAdministratif.belongsTo(Batiment, {
  foreignKey: "id_batiment",
  as: "batiment",
});

Admin.hasMany(Actualite, { foreignKey: "id_admin", as: "actualites" });
Actualite.belongsTo(Admin, { foreignKey: "id_admin", as: "admin" });

Filiere.belongsToMany(StaffEnseignant, {
  through: "filiere_enseignants",
  foreignKey: "id_filiere",
  otherKey: "id_enseignant",
  as: "enseignants",
});
StaffEnseignant.belongsToMany(Filiere, {
  through: "filiere_enseignants",
  foreignKey: "id_enseignant",
  otherKey: "id_filiere",
  as: "filieres",
});
Actualite.hasMany(ActualitePhoto, { foreignKey: "id_actualite", as: "photos" });
ActualitePhoto.belongsTo(Actualite, {
  foreignKey: "id_actualite",
  as: "actualite",
});

// ── ROUTES ──
const authRoutes = require("./routes/authRoutes");
const actualiteRoutes = require("./routes/actualiterRoutes");
const departementRoutes = require("./routes/departementRoutes");
const filiereRoutes = require("./routes/filiereRoutes");
const enseignantRoutes = require("./routes/enseignantRoutes");
const batimentRoutes = require("./routes/batimentRoutes");
const salleRoutes = require("./routes/salleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const iaRoutes = require("./routes/iaRoutes");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ── API ROUTES ──
app.use("/api/auth", authRoutes);
app.use("/api/actualites", actualiteRoutes);
app.use("/api/departements", departementRoutes);
app.use("/api/filieres", filiereRoutes);
app.use("/api/enseignants", enseignantRoutes);
app.use("/api/batiments", batimentRoutes);
app.use("/api/salles", salleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/ia", iaRoutes);

app.get("/", (req, res) => res.json({ message: "🚀 IUTGate API running !" }));

app.use(errorHandler);

// ── SYNC BDD ──
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Base de données synchronisée (alter)");
  } catch (err) {
    console.error("❌ Erreur BDD (alter):", err);
    console.warn(
      "Tentative de synchronisation sans 'alter' pour démarrer le serveur...",
    );
    try {
      await sequelize.sync();
      console.log("✅ Base de données synchronisée (no alter)");
    } catch (err2) {
      console.error("❌ Erreur BDD (sync):", err2);
      process.exit(1);
    }
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server → http://localhost:${PORT}`));
})();
