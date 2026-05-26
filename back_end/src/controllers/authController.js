const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const transporter = require("../config/mailer");

exports.register = async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;
    const existing = await Admin.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email déjà utilisé" });
    const hashed = await bcrypt.hash(mot_de_passe, 10);
    const admin = await Admin.create({ nom, email, mot_de_passe: hashed });
    res.status(201).json({ message: "Admin créé", admin });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;
    const admin = await Admin.findOne({ where: { email } });
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
      admin: { id_admin: admin.id_admin, nom: admin.nom, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id_admin, {
      attributes: { exclude: ["mot_de_passe"] },
    });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nom, email } = req.body;
    const admin = await Admin.findByPk(req.admin.id_admin);
    if (!admin) return res.status(404).json({ message: "Admin non trouvé" });

    // Vérif email unique si changé
    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ where: { email } });
      if (existing)
        return res.status(400).json({ message: "Email déjà utilisé" });
    }

    await admin.update({ nom: nom || admin.nom, email: email || admin.email });
    res.json({
      message: "Profil mis à jour",
      admin: { id_admin: admin.id_admin, nom: admin.nom, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { ancien_mot_de_passe, nouveau_mot_de_passe } = req.body;
    if (!ancien_mot_de_passe || !nouveau_mot_de_passe)
      return res.status(400).json({ message: "Tous les champs sont requis" });

    const admin = await Admin.findByPk(req.admin.id_admin);
    const isMatch = await bcrypt.compare(
      ancien_mot_de_passe,
      admin.mot_de_passe,
    );
    if (!isMatch)
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    if (nouveau_mot_de_passe.length < 6)
      return res
        .status(400)
        .json({ message: "Le mot de passe doit faire au moins 6 caractères" });

    const hashed = await bcrypt.hash(nouveau_mot_de_passe, 10);
    await admin.update({ mot_de_passe: hashed });
    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });

    const admin = await Admin.findOne({ where: { email } });
    if (!admin)
      return res.status(404).json({ message: "Aucun compte avec cet email" });

    // Génère token unique
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await admin.update({ reset_token: token, reset_token_expiry: expiry });

    const resetUrl = `http://localhost:5173/admin/reset-password?token=${token}`;

    // Email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "🔐 Réinitialisation de votre mot de passe — IUTGate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
          <div style="background: #0c1a40; padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #06B6D4; margin: 0; font-size: 24px;">IUTGate</h1>
            <p style="color: #94a3b8; margin: 8px 0 0; font-size: 13px;">Portail Numérique IUT Douala</p>
          </div>

          <div style="background: #fff; padding: 28px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 12px;">Réinitialisation du mot de passe</h2>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
              Bonjour <strong>${admin.nom}</strong>,<br/>
              Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le bouton ci-dessous.
              Ce lien expire dans <strong>1 heure</strong>.
            </p>

            <a href="${resetUrl}"
               style="display: block; background: #06B6D4; color: #164e63; text-decoration: none;
                      padding: 14px 24px; border-radius: 8px; font-weight: 700;
                      font-size: 14px; text-align: center; margin-bottom: 20px;">
              🔐 Réinitialiser mon mot de passe
            </a>

            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
              Si vous n'avez pas demandé cela, ignorez cet email. Votre mot de passe reste inchangé.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">
            © 2026 IUTGate — Institut Universitaire de Technologie de Douala
          </p>
        </div>
      `,
    });

    res.json({ message: "Email de réinitialisation envoyé !" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de l'envoi de l'email", err: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, nouveau_mot_de_passe } = req.body;
    if (!token || !nouveau_mot_de_passe)
      return res.status(400).json({ message: "Token et mot de passe requis" });

    const admin = await Admin.findOne({ where: { reset_token: token } });
    if (!admin)
      return res.status(400).json({ message: "Lien invalide ou expiré" });

    if (new Date() > new Date(admin.reset_token_expiry))
      return res
        .status(400)
        .json({ message: "Lien expiré. Refaites une demande." });

    if (nouveau_mot_de_passe.length < 6)
      return res
        .status(400)
        .json({ message: "Mot de passe trop court (min 6 caractères)" });

    const hashed = await bcrypt.hash(nouveau_mot_de_passe, 10);
    await admin.update({
      mot_de_passe: hashed,
      reset_token: null,
      reset_token_expiry: null,
    });

    // Email de confirmation
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: admin.email,
      subject: "✅ Mot de passe modifié — IUTGate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
          <div style="background: #0c1a40; padding: 24px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: #06B6D4; margin: 0; font-size: 24px;">IUTGate</h1>
          </div>
          <div style="background: #fff; padding: 28px; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center;">
            <div style="width: 56px; height: 56px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">✅</div>
            <h2 style="color: #0f172a; margin: 0 0 12px;">Mot de passe modifié !</h2>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              Bonjour <strong>${admin.nom}</strong>,<br/>
              Votre mot de passe a été modifié avec succès. Si ce n'est pas vous, contactez-nous immédiatement.
            </p>
          </div>
        </div>
      `,
    });

    res.json({ message: "Mot de passe réinitialisé avec succès !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};
