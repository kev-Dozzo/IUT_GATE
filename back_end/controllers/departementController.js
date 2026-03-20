const { Departement } = require("../models/Departement");

exports.getAll = async (req, res) => {
  try {
    const depts = await Departement.findAll({ order: [["nom", "ASC"]] });
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.create = async (req, res) => {
  try {
    const dept = await Departement.create({
      ...req.body,
      id_admin: req.admin.id_admin,
    });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.update = async (req, res) => {
  try {
    const dept = await Departement.findByPk(req.params.id);
    if (!dept)
      return res.status(404).json({ message: "Département non trouvé" });
    await dept.update(req.body);
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.delete = async (req, res) => {
  try {
    const dept = await Departement.findByPk(req.params.id);
    if (!dept)
      return res.status(404).json({ message: "Département non trouvé" });
    await dept.destroy();
    res.json({ message: "Département supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
