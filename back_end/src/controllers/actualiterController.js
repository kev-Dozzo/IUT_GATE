const Actualite = require("../models/Actualiter");
const ActualitePhoto = require("../models/ActualitePhoto");
const Admin = require("../models/Admin");

exports.getAll = async (req, res) => {
  try {
    const actualites = await Actualite.findAll({
      order: [["date_publication", "DESC"]],
      include: [
        {
          model: ActualitePhoto,
          as: "photos",
          attributes: ["id_photo", "url", "ordre"],
        },
      ],
    });
    res.json(actualites);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const actualite = await Actualite.findByPk(req.params.id, {
      include: [
        {
          model: ActualitePhoto,
          as: "photos",
          attributes: ["id_photo", "url", "ordre"],
        },
      ],
    });
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

    // Photo principale = premier fichier
    const photoUrl =
      req.files?.length > 0 ? `/uploads/${req.files[0].filename}` : null;

    const actualite = await Actualite.create({
      titre,
      contenu,
      categorie,
      photo_url: photoUrl,
      id_admin: req.admin.id_admin,
      date_publication: new Date(),
    });

    // Photos supplémentaires
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        await ActualitePhoto.create({
          id_actualite: actualite.id_actualite,
          url: `/uploads/${req.files[i].filename}`,
          ordre: i,
        });
      }
    }

    const full = await Actualite.findByPk(actualite.id_actualite, {
      include: [{ model: ActualitePhoto, as: "photos" }],
    });
    res.status(201).json(full);
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
    if (req.files?.length > 0) {
      updates.photo_url = `/uploads/${req.files[0].filename}`;
      // Ajoute les nouvelles photos sans supprimer les anciennes
      for (let i = 0; i < req.files.length; i++) {
        await ActualitePhoto.create({
          id_actualite: actualite.id_actualite,
          url: `/uploads/${req.files[i].filename}`,
          ordre: i,
        });
      }
    }
    await actualite.update(updates);
    const full = await Actualite.findByPk(actualite.id_actualite, {
      include: [{ model: ActualitePhoto, as: "photos" }],
    });
    res.json(full);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const actualite = await Actualite.findByPk(req.params.id);
    if (!actualite)
      return res.status(404).json({ message: "Actualité non trouvée" });
    await ActualitePhoto.destroy({ where: { id_actualite: req.params.id } });
    await actualite.destroy();
    res.json({ message: "Actualité supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err: err.message });
  }
};
