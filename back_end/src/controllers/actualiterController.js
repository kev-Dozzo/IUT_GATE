const Annonce = require("../models/Actualiter");

exports.getAll = async (req, res) => {
  try {
    const annonces = await Annonce.findAll({
      order: [["date_publication", "DESC"]],
    });
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getById = async (req, res) => {
  try {
    const annonce = await Annonce.findByPk(req.params.id);
    if (!annonce)
      return res.status(404).json({ message: "Annonce non trouvée" });
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Annonce.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const { titre, contenu, categorie } = req.body;
    const annonce = await Annonce.create({
      titre,
      contenu,
      categorie,
      photo_url: req.file ? `/uploads/${req.file.filename}` : null,
      id_admin: req.admin.id_admin,
      date_publication: new Date(),
    });
    res.status(201).json(annonce);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const annonce = await Annonce.findByPk(req.params.id);
    if (!annonce)
      return res.status(404).json({ message: "Annonce non trouvée" });
    const updates = { ...req.body };
    if (req.file) updates.photo_url = `/uploads/${req.file.filename}`;
    await annonce.update(updates);
    res.json(annonce);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const annonce = await Annonce.findByPk(req.params.id);
    if (!annonce)
      return res.status(404).json({ message: "Annonce non trouvée" });
    await annonce.destroy();
    res.json({ message: "Annonce supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
