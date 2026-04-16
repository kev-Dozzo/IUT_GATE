const Salle = require("../models/Salle");
const Batiment = require("../models/Batiment");

exports.getAll = async (req, res) => {
  try {
    const salles = await Salle.findAll({
      order: [["nom", "ASC"]],
      include: [
        { model: Batiment, as: "batiment", attributes: ["id_batiment", "nom"] },
      ],
    });
    res.json(salles);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getById = async (req, res) => {
  try {
    const salle = await Salle.findByPk(req.params.id, {
      include: [{ model: Batiment, as: "batiment" }],
    });
    if (!salle) return res.status(404).json({ message: "Salle non trouvée" });
    res.json(salle);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const salle = await Salle.create(req.body);
    res.status(201).json(salle);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const salle = await Salle.findByPk(req.params.id);
    if (!salle) return res.status(404).json({ message: "Salle non trouvée" });
    await salle.update(req.body);
    res.json(salle);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const salle = await Salle.findByPk(req.params.id);
    if (!salle) return res.status(404).json({ message: "Salle non trouvée" });
    await salle.destroy();
    res.json({ message: "Salle supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
