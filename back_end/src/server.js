const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const annonceRoutes = require("./routes/actualiterRoute");
const departementRoutes = require("./routes/departementRoute");
const filiereRoutes = require("./routes/filiereRoute");
const enseignantRoutes = require("./routes/enseignantRoute");
const batimentRoutes = require("./routes/batimentRoute");
const salleRoutes = require("./routes/salleRoute");
const serviceRoutes = require("./routes/serviceAdminRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les images uploadées
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/annonces", annonceRoutes);
app.use("/api/departements", departementRoutes);
app.use("/api/filieres", filiereRoutes);
app.use("/api/enseignants", enseignantRoutes);
app.use("/api/batiments", batimentRoutes);
app.use("/api/salles", salleRoutes);
app.use("/api/services", serviceRoutes);

// Route test
app.get("/", (req, res) => {
  res.json({ message: "🚀 IUTGate API is running !" });
});

// Sync BDD + démarrage
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données synchronisée");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Erreur BDD:", err));
