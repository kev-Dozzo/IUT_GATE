const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");

const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/auth", authRoutes);

// Sync BDD et démarrage
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données synchronisée");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port y http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Erreur BDD:", err));
