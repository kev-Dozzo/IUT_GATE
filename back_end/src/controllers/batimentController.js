const Batiment = require("../models/Batiment");
const Salle = require("../models/Salle");

exports.getAll = async (req, res) => {
  try {
    const batiments = await Batiment.findAll({
      order: [["nom", "ASC"]],
      include: [
        {
          model: Salle,
          as: "salles",
          attributes: ["id_salle", "nom", "type", "capacite"],
        },
      ],
    });
    res.json(batiments);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getById = async (req, res) => {
  try {
    const bat = await Batiment.findByPk(req.params.id, {
      include: [{ model: Salle, as: "salles" }],
    });
    if (!bat) return res.status(404).json({ message: "Bâtiment non trouvé" });
    res.json(bat);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await Batiment.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const bat = await Batiment.create({
      ...req.body,
      photo_url: req.file ? `/uploads/${req.file.filename}` : null,
      id_admin: req.admin.id_admin,
    });
    res.status(201).json(bat);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const bat = await Batiment.findByPk(req.params.id);
    if (!bat) return res.status(404).json({ message: "Bâtiment non trouvé" });
    const updates = { ...req.body };
    if (req.file) updates.photo_url = `/uploads/${req.file.filename}`;
    await bat.update(updates);
    res.json(bat);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const bat = await Batiment.findByPk(req.params.id);
    if (!bat) return res.status(404).json({ message: "Bâtiment non trouvé" });
    await bat.destroy();
    res.json({ message: "Bâtiment supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
