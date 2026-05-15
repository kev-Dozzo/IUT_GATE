const Actualite = require("../models/Actualiter");
const Admin = require("../models/Admin");

exports.getAll = async (req, res) => {
  try {
    const actualites = await Actualite.findAll({
      order: [["date_publication", "DESC"]],
      include: [{ model: Admin, as: "admin", attributes: ["nom"] }],
    });
    res.json(actualites);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const actualite = await Actualite.findByPk(req.params.id);
    if (!actualite)
      return res.status(404).json({ message: "Actualité non trouvée" });
    res.json(actualite);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Actualite.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { titre, contenu, categorie } = req.body;
    if (!titre || !contenu)
      return res.status(400).json({ message: "Titre et contenu obligatoires" });
    const actualite = await Actualite.create({
      titre,
      contenu,
      categorie,
      photo_url: req.file ? `/uploads/${req.file.filename}` : null,
      id_admin: req.admin.id_admin,
      date_publication: new Date(),
    });
    res.status(201).json(actualite);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const actualite = await Actualite.findByPk(req.params.id);
    if (!actualite)
      return res.status(404).json({ message: "Actualité non trouvée" });
    const updates = { ...req.body };
    if (req.file) updates.photo_url = `/uploads/${req.file.filename}`;
    await actualite.update(updates);
    res.json(actualite);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const actualite = await Actualite.findByPk(req.params.id);
    if (!actualite)
      return res.status(404).json({ message: "Actualité non trouvée" });
    await actualite.destroy();
    res.json({ message: "Actualité supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};
