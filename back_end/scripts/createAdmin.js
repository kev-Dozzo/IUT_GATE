const readline = require("readline");
const bcrypt = require("bcryptjs");
const sequelize = require("../src/config/database");
const Admin = require("../src/models/Admin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Pose une question normale (texte visible)
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

// Pose une question avec mot de passe masqué (affiche *)
function askPassword(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);

    let password = "";
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    const onData = (char) => {
      char = char.toString();

      switch (char) {
        case "\n":
        case "\r":
        case "\u0004": // Ctrl+D
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(password);
          break;
        case "\u0003": // Ctrl+C
          process.exit();
          break;
        case "\u007f": // Backspace
        case "\b":
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write("\b \b");
          }
          break;
        default:
          password += char;
          process.stdout.write("*");
          break;
      }
    };

    stdin.on("data", onData);
  });
}

// Validation email simple
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function main() {
  console.log("\n========================================");
  console.log("   🔐 Création d'un compte Administrateur");
  console.log("========================================\n");

  try {
    await sequelize.authenticate();
    console.log("✅ Connecté à la base de données\n");

    // ── NOM ──
    let nom = "";
    while (!nom) {
      nom = await ask("👤 Nom complet de l'admin : ");
      if (!nom) console.log("   ⚠️  Le nom ne peut pas être vide.\n");
    }

    // ── EMAIL ──
    let email = "";
    while (true) {
      email = await ask("📧 Email : ");
      if (!isValidEmail(email)) {
        console.log("   ⚠️  Email invalide. Réessaie.\n");
        continue;
      }

      const existing = await Admin.findOne({ where: { email } });
      if (existing) {
        console.log("   ⚠️  Un admin existe déjà avec cet email. Réessaie.\n");
        continue;
      }
      break;
    }

    // ── MOT DE PASSE ──
    let password = "";
    while (true) {
      password = await askPassword("🔑 Mot de passe (min. 8 caractères) : ");
      if (password.length < 8) {
        console.log(
          "\n   ⚠️  Le mot de passe doit faire au moins 8 caractères.\n",
        );
        continue;
      }

      const confirm = await askPassword("🔑 Confirmer le mot de passe : ");
      if (confirm !== password) {
        console.log(
          "\n   ⚠️  Les mots de passe ne correspondent pas. Réessaie.\n",
        );
        continue;
      }
      break;
    }

    // ── RÉCAPITULATIF ──
    console.log("\n----------------------------------------");
    console.log("📋 Récapitulatif :");
    console.log(`   Nom   : ${nom}`);
    console.log(`   Email : ${email}`);
    console.log("   Mot de passe : ********");
    console.log("----------------------------------------\n");

    const confirmCreate = await ask("✅ Confirmer la création ? (oui/non) : ");

    if (
      confirmCreate.toLowerCase() !== "oui" &&
      confirmCreate.toLowerCase() !== "o"
    ) {
      console.log("\n❌ Création annulée.\n");
      process.exit(0);
    }

    // ── CRÉATION ──
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      nom,
      email,
      mot_de_passe: hashedPassword,
    });

    console.log("\n✅ Administrateur créé avec succès !");
    console.log(`   Email : ${email}`);
    console.log(`   Mot de passe : (celui que tu as saisi)\n`);

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Erreur :", err.message);
    process.exit(1);
  }
}

main();
