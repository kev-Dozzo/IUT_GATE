const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { findByEmail, updatePasswordById } = require("../models/Admin");

dotenv.config();

const resetTokens = new Map();

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const admin = await findByEmail(email);
    if (!admin) return res.status(404).json({ message: "Admin non trouvé" });
    const isMatch = await bcrypt.compare(mot_de_passe, admin.mot_de_passe);
    if (!isMatch)
      return res.status(400).json({ message: "Mot de passe incorrect" });
    const token = jwt.sign(
      { id_admin: admin.id_admin, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.json({
      message: "Connexion réussie",
      token,
      admin: {
        id_admin: admin.id_admin,
        nom: admin.nom,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const admin = await findByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: "Admin introuvable" });
    }

    const token = Math.random().toString(36).slice(2, 18);
    resetTokens.set(token, {
      id: admin.id_admin,
      email,
      expiresAt: Date.now() + 1000 * 60 * 30,
    });

    res.status(200).json({ message: "Lien de réinitialisation généré", token });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, mot_de_passe } = req.body;

    if (!token || !mot_de_passe) {
      return res.status(400).json({ message: "Token et mot de passe requis" });
    }

    const reset = resetTokens.get(token);
    if (!reset || reset.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    await updatePasswordById(reset.id, hashedPassword);
    resetTokens.delete(token);

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    next(err);
  }
};
