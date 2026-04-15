import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findByEmail, updatePasswordById } from "../models/Admin.js";

dotenv.config();

const resetTokens = new Map();

export const login = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const admin = await findByEmail(email);
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const isValid = await bcrypt.compare(mot_de_passe, admin.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    res
      .status(200)
      .json({
        token,
        admin: { id: admin.id, nom: admin.nom, email: admin.email },
      });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
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
      id: admin.id,
      email,
      expiresAt: Date.now() + 1000 * 60 * 30,
    });

    res.status(200).json({ message: "Lien de réinitialisation généré", token });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
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
