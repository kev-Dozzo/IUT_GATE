const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    // Vérifier si l'email existe déjà
    const existing = await Admin.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashed = await bcrypt.hash(mot_de_passe, 10);

    const admin = await Admin.create({ nom, email, mot_de_passe: hashed });

    res.status(201).json({ message: "Admin créé avec succès", admin });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id_admin: admin.id_admin, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({ message: "Connexion réussie", token, admin });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Profil (route protégée)
exports.profile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id_admin, {
      attributes: { exclude: ["mot_de_passe"] },
    });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
