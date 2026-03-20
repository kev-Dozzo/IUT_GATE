const { StaffEnseignant } = require("../models/StaffEnseignant");

exports.getAll = async (req, res) => {
  try {
    const enseignants = await StaffEnseignant.findAll({
      order: [["nom", "ASC"]],
    });
    res.json(enseignants);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const ens = await StaffEnseignant.create({
      ...req.body,
      created_by_admin: req.admin.id_admin,
    });
    res.status(201).json(ens);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const ens = await StaffEnseignant.findByPk(req.params.id);
    if (!ens) return res.status(404).json({ message: "Enseignant non trouvé" });
    await ens.update(req.body);
    res.json(ens);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const ens = await StaffEnseignant.findByPk(req.params.id);
    if (!ens) return res.status(404).json({ message: "Enseignant non trouvé" });
    await ens.destroy();
    res.json({ message: "Enseignant supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
