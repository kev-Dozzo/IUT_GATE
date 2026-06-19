// back_end/scripts/listAdmins.js
const sequelize = require("../src/config/database");
const Admin = require("../src/models/Admin");

async function main() {
  await sequelize.authenticate();
  const admins = await Admin.findAll({
    attributes: ["id_admin", "nom", "email", "createdAt"],
  });

  console.log("\n📋 Liste des administrateurs :\n");
  admins.forEach((a) => {
    console.log(
      `  #${a.id_admin} — ${a.nom} (${a.email}) — créé le ${a.createdAt.toLocaleDateString("fr-FR")}`,
    );
  });
  console.log("");
  process.exit(0);
}

main();
