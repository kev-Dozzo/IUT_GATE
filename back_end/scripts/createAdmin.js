import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import db from "../src/config/db.js";
import { findByEmail, createAdmin as createAdminModel } from "../src/models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Connecté à la base de données");

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        nom VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("✅ Table admins créée ou existante");

    const nom = "Admin IUT";
    const email = "admin@iut.cm";
    const password = "Admin@2026";

    const existing = await findByEmail(email);
    if (existing) {
      console.log("⚠️  Un admin avec cet email existe déjà !");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await createAdminModel({ nom, email, password: hashed });

    console.log("\n✅ Admin créé avec succès !");
    console.log("─────────────────────────────");
    console.log(` Email    : ${email}`);
    console.log(` Password : ${password}`);
    console.log(` ID       : ${admin.id}`);
    console.log("─────────────────────────────");
    console.log("⚠️  Changez le mot de passe après la première connexion !\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    process.exit(1);
  }
};

createAdmin();
