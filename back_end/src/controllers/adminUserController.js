const Admin = require("../models/Admin");
const { sendWelcomeAdmin, sendNewAdminNotif } = require("../config/mailer");
const AdminActivity = require("../models/AdminActivity");
const bcrypt = require("bcryptjs");
const logActivity = require("../utils/logActivity");
const { ROLE_PERMISSIONS } = require("../config/permissions");

// Lister tous les admins
exports.getAll = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: [
        "id_admin",
        "nom",
        "email",
        "role",
        "permissions",
        "is_active",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un admin 
exports.create = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role, permissions } = req.body;

    const existing = await Admin.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email déjà utilisé" });

    const hash = await bcrypt.hash(mot_de_passe, 10);

    // Permissions = celles passées OU par défaut du rôle
    const perms =
      permissions?.length > 0
        ? permissions
        : ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.editeur;

    const admin = await Admin.create({
      nom,
      email,
      mot_de_passe: hash,
      role: role || "editeur",
      permissions: perms,
    });

    sendWelcomeAdmin(admin.email, admin.nom, admin.role, admin.permissions);

    // Envoie notification au super admin
    const superAdmin = await Admin.findOne({ where: { role: "super_admin" } });
    if (superAdmin && superAdmin.email !== admin.email) {
      sendNewAdminNotif(superAdmin.email, admin);
    }

    await logActivity(
      req,
      "CREATE_USER",
      "admin",
      admin.id_admin,
      admin.nom,
      `Rôle: ${admin.role}`,
    );

    res.status(201).json({
      message: "Utilisateur créé",
      admin: {
        id_admin: admin.id_admin,
        nom: admin.nom,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier un admin 
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email, role, permissions, is_active, mot_de_passe } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    // Empêche de modifier le super admin principal (id 1) si on est pas lui
    if (admin.id_admin === 1 && req.admin.id_admin !== 1) {
      return res
        .status(403)
        .json({ message: "Impossible de modifier le super admin principal" });
    }

    const updates = { nom, email, role, is_active };

    if (permissions) updates.permissions = permissions;
    if (mot_de_passe)
      updates.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);

    await admin.update(updates);

    await logActivity(
      req,
      "UPDATE_USER",
      "admin",
      admin.id_admin,
      admin.nom,
      `Rôle: ${admin.role}`,
    );

    res.json({ message: "Utilisateur mis à jour", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Supprimer un admin ──
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === 1) {
      return res
        .status(403)
        .json({ message: "Impossible de supprimer le super admin principal" });
    }

    if (parseInt(id) === req.admin.id_admin) {
      return res
        .status(403)
        .json({ message: "Impossible de se supprimer soi-même" });
    }

    const admin = await Admin.findByPk(id);
    if (!admin)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    await logActivity(req, "DELETE_USER", "admin", admin.id_admin, admin.nom);
    await admin.destroy();

    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Historique  le mien 
exports.getMyActivity = async (req, res) => {
  try {
    const activities = await AdminActivity.findAll({
      where: { id_admin: req.admin.id_admin },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Historique — tous (super admin) ──
exports.getAllActivity = async (req, res) => {
  try {
    const Admin = require("../models/Admin");

    const activities = await AdminActivity.findAll({
      order: [["createdAt", "DESC"]],
      limit: 200,
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: ["nom", "email", "role"],
          required: false, // pour garder les activités même si admin supprimé
        },
      ],
    });
    res.json(activities);
  } catch (err) {
    console.error("Erreur getAllActivity:", err);
    res.status(500).json({ message: err.message });
  }
};
