const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

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

// ── ASSOCIATIONS ──
Departement.hasMany(Filiere, { foreignKey: "id_departement", as: "filieres" });
Filiere.belongsTo(Departement, { foreignKey: "id_departement", as: "departement" });

Departement.hasMany(StaffEnseignant, { foreignKey: "id_departement", as: "enseignants" });
StaffEnseignant.belongsTo(Departement, { foreignKey: "id_departement", as: "departement" });

Batiment.hasMany(Salle, { foreignKey: "id_batiment", as: "salles" });
Salle.belongsTo(Batiment, { foreignKey: "id_batiment", as: "batiment" });

Batiment.hasMany(StaffEnseignant, { foreignKey: "id_batiment", as: "enseignants_batiment" });
StaffEnseignant.belongsTo(Batiment, { foreignKey: "id_batiment", as: "batiment" });

Batiment.hasMany(ServiceAdministratif, { foreignKey: "id_batiment", as: "services" });
ServiceAdministratif.belongsTo(Batiment, { foreignKey: "id_batiment", as: "batiment" });

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

// ── ROUTES ──
const authRoutes = require("./routes/authRoutes");
const actualiteRoutes = require("./routes/actualiterRoutes");
const departementRoutes = require("./routes/departementRoutes");
const filiereRoutes = require("./routes/filiereRoutes");
const enseignantRoutes = require("./routes/enseignantRoutes");
const batimentRoutes = require("./routes/batimentRoutes");
const salleRoutes = require("./routes/salleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// ── API ROUTES ──
app.use("/api/auth", authRoutes);
app.use("/api/actualites", actualiteRoutes);
app.use("/api/departements", departementRoutes);
app.use("/api/filieres", filiereRoutes);
app.use("/api/enseignants", enseignantRoutes);
app.use("/api/batiments", batimentRoutes);
app.use("/api/salles", salleRoutes);
app.use("/api/services", serviceRoutes);

app.get("/", (req, res) => res.json({ message: "🚀 IUTGate API running !" }));

// ── SYNC BDD ──
//sequelize
 // .sync({ alter: false })
//  .then(() => {
  //  console.log("✅ Base de données synchronisée");
    //const PORT = process.env.PORT || 5000;
   // app.listen(PORT, () => console.log(`🚀 Server → http://localhost:${PORT}`));
 // })
 // .catch((err) => console.error("❌ Erreur BDD:", err));
 
 // ✅ APRÈS (correction) :
const startServer = async () => {
  try {

    // 1️⃣ Tables parents (pas de clés étrangères)
    await Admin.sync({ alter: true })
    await Departement.sync({ alter: true })
    await Batiment.sync({ alter: true })
    console.log('✅ Tables parents OK')

    // 2️⃣ Tables enfants (dépendent des parents)
    await Filiere.sync({ alter: true })
    await StaffEnseignant.sync({ alter: true })
    await Salle.sync({ alter: true })
    await ServiceAdministratif.sync({ alter: true })
    await Actualite.sync({ alter: true })
    console.log('✅ Tables enfants OK')

    // 3️⃣ Tables de liaison (en DERNIER)
    await sequelize.sync({ alter: true })
    console.log('✅ Tables de liaison OK')

    console.log('✅ Base de données synchronisée avec succès !')

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`🚀 Serveur IUT GATE → http://localhost:${PORT}`)
    })

  } catch (err) {
    console.error('❌ Erreur démarrage:', err.message)
    process.exit(1)
  }
}

startServer()