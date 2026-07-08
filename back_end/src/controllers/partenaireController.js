const Partenaire = require("../models/Partenaire");
const logActivity = require("../utils/logActivity");
const path = require("path");
const fs = require("fs");

exports.getAll = async (req, res) => {
  try {
    const partenaires = await Partenaire.findAll({
      where: { actif: true },
      order: [
        ["ordre", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
    res.json(partenaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const partenaires = await Partenaire.findAll({ order: [["ordre", "ASC"]] });
    res.json(partenaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom, lien, description, ordre } = req.body;
    const logo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const p = await Partenaire.create({
      nom,
      lien,
      description,
      ordre: ordre || 0,
      logo_url,
      id_admin: req.admin?.id_admin,
    });
    await logActivity(req, "CREATE", "partenaire", p.id_partenaire, p.nom);
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const p = await Partenaire.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: "Introuvable" });
    const { nom, lien, description, ordre, actif } = req.body;
    const updates = { nom, lien, description, ordre, actif };
    if (req.file) updates.logo_url = `/uploads/${req.file.filename}`;
    await p.update(updates);
    await logActivity(req, "UPDATE", "partenaire", p.id_partenaire, p.nom);
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const p = await Partenaire.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: "Introuvable" });
    await logActivity(req, "DELETE", "partenaire", p.id_partenaire, p.nom);
    await p.destroy();
    res.json({ message: "Supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
