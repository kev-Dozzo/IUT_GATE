const Actualite = require("../models/Actualiter");
const Admin = require("../models/Admin");
const path = require("path");
const fs = require("fs");

exports.getAll = async (req, res) => {
  try {
    const actualites = await Actualite.findAll({
      order: [["date_publication", "DESC"]],
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

    // Fichiers uploadés (max 5)
    let photo_url = null;
    let fichiers = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, i) => {
        const url = `/uploads/${file.filename}`;
        if (i === 0 && file.mimetype.startsWith("image/")) {
          photo_url = url;
        }
        fichiers.push({
          url,
          nom: file.originalname,
          type: file.mimetype,
          taille: file.size,
        });
      });
    }

    const actualite = await Actualite.create({
      titre,
      contenu,
      categorie,
      photo_url,
      fichiers: JSON.stringify(fichiers),
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

    if (req.files && req.files.length > 0) {
      let fichiers = [];
      req.files.forEach((file, i) => {
        const url = `/uploads/${file.filename}`;
        if (i === 0 && file.mimetype.startsWith("image/")) {
          updates.photo_url = url;
        }
        fichiers.push({
          url,
          nom: file.originalname,
          type: file.mimetype,
          taille: file.size,
        });
      });
      updates.fichiers = JSON.stringify(fichiers);
    }

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
