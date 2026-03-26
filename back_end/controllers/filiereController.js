const { Filiere } = require("../models/Filiere");

exports.getAll = async (req, res) => {
  try {
    const filieres = await Filiere.findAll({ order: [["nom", "ASC"]] });
    res.json(filieres);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const filiere = await Filiere.create({
      ...req.body,
      id_admin: req.admin.id_admin,
    });
    res.status(201).json(filiere);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const filiere = await Filiere.findByPk(req.params.id);
    if (!filiere)
      return res.status(404).json({ message: "Filière non trouvée" });
    await filiere.update(req.body);
    res.json(filiere);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const filiere = await Filiere.findByPk(req.params.id);
    if (!filiere)
      return res.status(404).json({ message: "Filière non trouvée" });
    await filiere.destroy();
    res.json({ message: "Filière supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
