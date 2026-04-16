require("dotenv").config();
const bcrypt = require("bcryptjs");
const sequelize = require("../src/config/database");
const Admin = require("../src/models/Admin");

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connecté à la base de données");

    await Admin.sync({ alter: true });

    const email = "admin@iut.cm";
    const password = "Admin@2026";

    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      console.log("⚠️  Admin existe déjà !");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      nom: "Admin IUT",
      email,
      mot_de_passe: hashed,
    });

    console.log("\n  Admin créé avec succès !");
    console.log("─────────────────────────────");
    console.log(` Email    : ${email}`);
    console.log(` Password : ${password}`);
    console.log(` ID       : ${admin.id_admin}`);
    console.log("─────────────────────────────\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    process.exit(1);
  }
};

createAdmin();
