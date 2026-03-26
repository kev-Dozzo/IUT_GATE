const { Batiment } = require("../models/Batiment");

exports.getAll = async (req, res) => {
  try {
    const batiments = await Batiment.findAll({ order: [["nom", "ASC"]] });
    res.json(batiments);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const bat = await Batiment.create({
      ...req.body,
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
    await bat.update(req.body);
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
